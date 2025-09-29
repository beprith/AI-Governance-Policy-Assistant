import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Proxy to Langflow API
  app.post("/api/generate", async (req, res) => {
    try {
      const apiKey = process.env.LANGFLOW_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "LANGFLOW_API_KEY is not configured on the server" });
      }

      const { input_value, session_id } = (req.body ?? {}) as {
        input_value?: string;
        session_id?: string;
      };

      const payload = {
        output_type: "chat",
        input_type: "chat",
        input_value:
          input_value ??
          "Write me a policy to protect my data at rest and in transit when im querying a model, i want to use gcp",
        session_id: session_id ?? "user_1",
      };

      const response = await fetch(
        "http://localhost:7860/api/v1/run/6200f938-d182-4020-9471-8efe3dc20129",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify(payload),
        }
      );

      const contentType = response.headers.get("content-type") ?? "";

      if (!response.ok) {
        const errorText = contentType.includes("application/json")
          ? JSON.stringify(await response.json())
          : await response.text();
        return res
          .status(response.status)
          .json({ error: "Langflow request failed", status: response.status, details: errorText });
      }

      const raw = contentType.includes("application/json") ? await response.json() : await response.text();

      // Enhanced YAML isolation and formatting
      const extractAndSeparateContent = (value: unknown): { text: string; yaml: string } => {
        const keysToPrefer = ["text", "message", "content", "output", "result", "data"];

        // Function to format text as markdown
        const formatAsMarkdown = (text: string): string => {
          if (!text) return text;
          
          let markdown = text;
          
          // Convert numbered sections to markdown headers
          markdown = markdown.replace(/^(\d+)\.\s*\*\*([^*]+)\*\*:\s*/gm, '## $2\n\n');
          
          // Convert **text**: patterns to markdown headers
          markdown = markdown.replace(/^\*\*([^*]+)\*\*:\s*/gm, '### $1\n\n');
          
          // Convert bullet points to markdown lists
          markdown = markdown.replace(/^[-•]\s+/gm, '- ');
          
          // Ensure proper spacing around headers
          markdown = markdown.replace(/\n(#{1,6}[^\n]+)\n/g, '\n\n$1\n\n');
          
          // Clean up multiple newlines
          markdown = markdown.replace(/\n{3,}/g, '\n\n');
          
          // Format code snippets
          markdown = markdown.replace(/`([^`]+)`/g, '`$1`');
          
          // Add emphasis for key terms
          markdown = markdown.replace(/\b(OPA Rego|Terraform|HashiCorp Sentinel|YAML|JSON|GCP|AWS|Azure)\b/g, '**$1**');
          
          return markdown.trim();
        };

        const collectStrings = (v: unknown, depth: number, bag: string[]) => {
          if (v == null || depth > 8) return;
          if (typeof v === "string") {
            const trimmed = v.trim();
            if (trimmed && trimmed.length > 10) {
              bag.push(trimmed);
            }
            return;
          }
          if (Array.isArray(v)) {
            for (const item of v) collectStrings(item, depth + 1, bag);
            return;
          }
          if (typeof v === "object") {
            const obj = v as Record<string, unknown>;
            // prefer well-known keys first
            for (const k of keysToPrefer) {
              if (k in obj) collectStrings(obj[k], depth + 1, bag);
            }
            // then traverse remaining keys
            for (const [k, val] of Object.entries(obj)) {
              if (keysToPrefer.includes(k)) continue;
              collectStrings(val, depth + 1, bag);
            }
          }
        };

        const candidates: string[] = [];
        collectStrings(value, 0, candidates);
        
        if (candidates.length === 0) {
          return { text: "", yaml: "" };
        }
        
        // Get the longest candidate
        const fullContent = candidates.sort((a, b) => b.length - a.length)[0];
        
        // Clean up the content
        const cleanContent = fullContent
          .replace(/\n\s*\n\s*\n/g, '\n\n')
          .trim();

        // Enhanced YAML formatting function
        const formatYAML = (yamlString: string): string => {
          if (!yamlString) return yamlString;
          
          const lines = yamlString.split('\n');
          const formattedLines: string[] = [];
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            
            // Skip empty lines - we'll handle spacing strategically
            if (!trimmed) continue;
            
            let indentLevel = 0;
            let addSpaceBefore = false;
            
            // Determine indentation based on YAML structure
            if (trimmed.startsWith('- governance_trace:')) {
              indentLevel = 0;
              // Add space before second and subsequent governance traces
              if (formattedLines.length > 0) {
                addSpaceBefore = true;
              }
            } else if (trimmed.match(/^(principle|policy|control):/)) {
              indentLevel = 1; // 2 spaces
            } else if (trimmed.match(/^(id|description):/)) {
              indentLevel = 2; // 4 spaces
            } else if (trimmed === 'policy_as_code:') {
              indentLevel = 1; // 2 spaces
              addSpaceBefore = true;
            } else if (trimmed.startsWith('- platform:')) {
              indentLevel = 2; // 4 spaces under policy_as_code
            } else if (trimmed.match(/^(platform|language|logic_description|rego_code|sentinel_code):/)) {
              indentLevel = 3; // 6 spaces
            } else {
              // Default fallback - try to maintain reasonable indentation
              indentLevel = 2;
            }
            
            // Add strategic spacing
            if (addSpaceBefore && formattedLines.length > 0) {
              formattedLines.push('');
            }
            
            // Apply indentation (2 spaces per level)
            const indent = '  '.repeat(indentLevel);
            formattedLines.push(indent + trimmed);
          }
          
          // Remove any leading empty lines
          while (formattedLines.length > 0 && formattedLines[0] === '') {
            formattedLines.shift();
          }
          
          // Clean up multiple consecutive empty lines
          const cleanLines: string[] = [];
          let lastWasEmpty = false;
          
          for (const line of formattedLines) {
            if (line === '') {
              if (!lastWasEmpty) {
                cleanLines.push(line);
              }
              lastWasEmpty = true;
            } else {
              cleanLines.push(line);
              lastWasEmpty = false;
            }
          }
          
          return cleanLines.join('\n').trim();
        };
        
        // Method 1: Look for ```yaml blocks first
        const yamlBlockMatch = cleanContent.match(/```yaml\s*([\s\S]*?)\s*```/);
        if (yamlBlockMatch) {
          const yamlContent = formatYAML(yamlBlockMatch[1].trim());
          let textContent = cleanContent
            .replace(/```yaml\s*[\s\S]*?\s*```/, '')
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .trim();
          
          // Format text as markdown
          textContent = formatAsMarkdown(textContent);
          
          return {
            text: textContent,
            yaml: yamlContent
          };
        }
        
        // Method 2: Look for YAML patterns in the content
        const lines = cleanContent.split('\n');
        let yamlStartIndex = -1;
        
        // Look for common YAML indicators
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (
            line.startsWith('- governance_trace:') ||
            line.startsWith('governance_trace:') ||
            line.startsWith('- principle:') ||
            line.startsWith('- policy:') ||
            line.startsWith('policy_as_code:') ||
            (line.includes(':') && (line.includes('governance') || line.includes('policy') || line.includes('control'))) ||
            line.match(/^\s*-\s+\w+:/) || // YAML list items
            line.match(/^\w+:\s*$/) // YAML keys
          ) {
            yamlStartIndex = i;
            break;
          }
        }
        
        // Method 3: Look for the first line that looks like YAML structure
        if (yamlStartIndex === -1) {
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            // Check if line has YAML-like structure (key: value or - item)
            if (line.match(/^[\w\s]+:\s*[\w\s]*$/) || line.match(/^\s*-\s+[\w\s]+/)) {
              yamlStartIndex = i;
              break;
            }
          }
        }
        
        if (yamlStartIndex >= 0) {
          // Find a good split point - prefer after complete sentences
          let textEndIndex = yamlStartIndex;
          for (let i = yamlStartIndex - 1; i >= 0; i--) {
            const line = lines[i].trim();
            if (line.endsWith('.') || line.endsWith(':') || line === '') {
              textEndIndex = i + 1;
              break;
            }
          }
          
          const textLines = lines.slice(0, textEndIndex);
          const yamlLines = lines.slice(yamlStartIndex);
          
          return {
            text: formatAsMarkdown(textLines.join('\n').trim()),
            yaml: formatYAML(yamlLines.join('\n').trim())
          };
        }
        
        // Method 4: If no clear YAML found, try to split on common indicators
        const yamlIndicators = ['```yaml', 'governance_trace:', 'policy_as_code:', '- platform:', '- governance_trace:'];
        for (const indicator of yamlIndicators) {
          const splitIndex = cleanContent.indexOf(indicator);
          if (splitIndex > 0) {
            const yamlPart = cleanContent.substring(splitIndex).replace(/```yaml|```/g, '').trim();
            return {
              text: formatAsMarkdown(cleanContent.substring(0, splitIndex).trim()),
              yaml: formatYAML(yamlPart)
            };
          }
        }
        
        // Default: if content looks mostly like YAML, put it in yaml, otherwise in text
        const yamlLikeLines = lines.filter(line => {
          const trimmed = line.trim();
          return trimmed.match(/^[\w\s]+:\s*/) || trimmed.startsWith('- ') || trimmed === '';
        });
        
        if (yamlLikeLines.length > lines.length * 0.3) {
          // More than 30% of lines look like YAML
          return {
            text: formatAsMarkdown("Generated governance policy with compliance controls and implementation details."),
            yaml: formatYAML(cleanContent)
          };
        }
        
        // Default: return all as text
        return {
          text: formatAsMarkdown(cleanContent),
          yaml: ""
        };
      };

      const { text, yaml } = extractAndSeparateContent(raw);

      return res.status(200).json({ 
        ok: true, 
        text: text || "No explanatory text found", 
        yaml: yaml || "No YAML content found",
        raw 
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return res.status(500).json({ error: "Internal server error", details: message });
    }
  });

  return app;
}
