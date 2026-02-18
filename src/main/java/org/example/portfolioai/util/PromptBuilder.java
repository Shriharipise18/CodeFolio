package org.example.portfolioai.util;

public class PromptBuilder {

        public static String buildBioPrompt(String role, String skills, String experience, String projects) {
                return String.format(
                                "Generate a professional, recruiter-friendly portfolio bio for a %s.\n" +
                                                "Skills: %s\n" +
                                                "Experience: %s\n" +
                                                "Projects: %s\n" +
                                                "\n" +
                                                "Requirements:\n" +
                                                "- 3-4 lines maximum.\n" +
                                                "- Professional tone.\n" +
                                                "- No emojis.\n" +
                                                "- Highlight impact and technical strength.\n" +
                                                "- Output ONLY the biographical paragraph. Do not include any intro or outro text.",
                                role, skills, experience, projects);
        }

        public static String buildAnalysisPrompt(String role, String skills, String experience, String projects) {
                return String.format(
                                "Act as a critical Senior Technical Recruiter. Analyze the candidate's resume for the target role of '%s'.\n"
                                                +
                                                "Candidate Data:\n" +
                                                "Skills: %s\n" +
                                                "Experience: %s\n" +
                                                "Projects: %s\n" +
                                                "\n" +
                                                "CRITICAL SCORING RULES:\n" +
                                                "1. Be harsh and realistic. Do NOT be polite. Do NOT give participation awards.\n"
                                                +
                                                "2. If the 'Skills' or 'Projects' sections are brief, vague, or empty, the score MUST be low (e.g., 10-40).\n"
                                                +
                                                "3. A score of 90+ is reserved ONLY for perfect matches with extensive, relevant detailed experience.\n"
                                                +
                                                "4. 'sectionScores' must differentiate. Do not give the same score for everything.\n"
                                                +
                                                "\n" +
                                                "Respond strictly in JSON format with the following keys:\n" +
                                                "- 'matchScore': Integer (0-100) indicating overall fit.\n" +
                                                "- 'summary': A concise, critical executive summary (2 sentences).\n" +
                                                "- 'sectionScores': JSON Object with integer scores (0-100) for keys: 'Skills', 'Projects'. (Ensure these vary based on input quality).\n"
                                                +
                                                "- 'strengths': JSON Array of strings (What actually matches).\n" +
                                                "- 'weaknesses': JSON Array of strings (Be specific about what is missing).\n"
                                                +
                                                "- 'improvementTips': JSON Array of actionable advice.\n" +
                                                "\n" +
                                                "Output ONLY valid JSON. No markdown formatting.",
                                role, skills, experience, projects);
        }

        public static String buildWebsitePrompt(String role, String skills, String experience, String projects,
                        String name, String email, String phone, String linkedin, String github, String themeColor,
                        String fontStyle, String backgroundStyle, String sectionSpacing, String cornerStyle,
                        String template, java.util.List<String> sectionOrder) {

                String templateInstructions = "";
                String textMain = "#f8fafc"; // Default light text
                String textMuted = "#94a3b8"; // Default muted text
                String bgBase = "#0f172a"; // Default dark bg

                if ("Minimal".equalsIgnoreCase(template)) {
                        templateInstructions = "### Design System (Minimalist)\n" +
                                        "- **Theme**: Clean, White/Light Gray background, Dark Text.\n" +
                                        "- **Typography**: Serif for headings (e.g., 'Playfair Display'), Sans-serif for body.\n"
                                        +
                                        "- **Visuals**: No complex gradients. Use generous whitespace. Thin borders.\n"
                                        +
                                        "- **Layout**: Single column or simple grid. Focus on typography.\n";
                        textMain = "#1e293b"; // Slate 800
                        textMuted = "#64748b"; // Slate 500
                        bgBase = "#ffffff";
                } else if ("Professional".equalsIgnoreCase(template)) {
                        templateInstructions = "### Design System (Professional & Corporate)\n" +
                                        "- **Theme**: Trustworthy, Deep Blue/Navy & White, Clean lines.\n" +
                                        "- **Typography**: Highly legible Sans-serif (e.g., 'Lato', 'Roboto').\n" +
                                        "- **Visuals**: subtle box shadows, structured cards, professional layout.\n" +
                                        "- **Interactive**: Gentle transitions, no aggressive animations.\n";
                        textMain = "#1e293b"; // Slate 800
                        textMuted = "#64748b"; // Slate 500
                        bgBase = "#f8fafc"; // Slate 50
                } else if ("Developer".equalsIgnoreCase(template)) {
                        templateInstructions = "### Design System (Developer / Hacker)\n" +
                                        "- **Theme**: Dark Terminal, Matrix Green (#00ff41) on Black.\n" +
                                        "- **Typography**: Monospace (e.g., 'Fira Code', 'Courier Prime').\n" +
                                        "- **Visuals**: CLI-style headers (e.g., > About), scanlines overlay (optional).\n"
                                        +
                                        "- **Interactive**: Blinking cursor effects, typing animations for headers.\n";
                        // Keep defaults (Dark mode)
                } else if ("Creative".equalsIgnoreCase(template)) {
                        templateInstructions = "### Design System (Creative / Brutalist)\n" +
                                        "- **Theme**: Bold, High Contrast, Brutalist touches.\n" +
                                        "- **Typography**: Large Display fonts, mix of Serif and Sans.\n" +
                                        "- **Visuals**: Asymmetrical layouts, raw borders, vibrant accent colors.\n" +
                                        "- **Interactive**: Parallax scrolling, large hover reveals.\n";
                        // Keep defaults (Dark mode usually fits better, or AI can override)
                } else {
                        // Default to Modern / Premium
                        templateInstructions = "### Design System & Aesthetics (Premium Grade)\n" +
                                        "- **Theme**: Cyberpunk / Glassmorphism / Modern Tech (Dark Mode Base).\n" +
                                        "- **Typography**: Use 'Outfit' or 'Plus Jakarta Sans' from Google Fonts.\n" +
                                        "- **Visuals**: \n" +
                                        "  - Background: Deep dark mesh gradients or animated geometric shapes.\n" +
                                        "  - Cards: Glassmorphism effect (translucent blur, thin white border).\n" +
                                        "  - Accents: Neon glows using the Theme Color.\n" +
                                        "- **Interactive**: \n" +
                                        "  - Hover effects on cards (lift + glow).\n" +
                                        "  - Scroll animations (fade-in up).\n";
                }

                // Map Customization to CSS
                String bgCss = "background-color: " + bgBase + ";"; // Use dynamic base
                if ("gradient".equalsIgnoreCase(backgroundStyle)) {
                        bgCss = "background: linear-gradient(135deg, " + bgBase + " 0%, #1e1b4b 100%);";
                        // If it's a light template, adjust gradient
                        if ("Minimal".equalsIgnoreCase(template) || "Professional".equalsIgnoreCase(template)) {
                                bgCss = "background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);";
                        }
                } else if ("mesh".equalsIgnoreCase(backgroundStyle)) {
                        bgCss = "background: radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%); background-color: "
                                        + bgBase + ";";
                        if ("Minimal".equalsIgnoreCase(template) || "Professional".equalsIgnoreCase(template)) {
                                bgCss = "background-color: #ffffff; background-image: radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%);";
                        }
                } else if ("particles".equalsIgnoreCase(backgroundStyle)) {
                        bgCss = "background-color: #000; background-image: radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px), radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px), radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px); background-size: 550px 550px, 350px 350px, 250px 250px;";
                        if ("Minimal".equalsIgnoreCase(template) || "Professional".equalsIgnoreCase(template)) {
                                bgCss = "background-color: #f8fafc; background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px;";
                        }
                }

                String radiusCss = "8px"; // Rounded
                if ("sharp".equalsIgnoreCase(cornerStyle))
                        radiusCss = "0px";
                if ("pill".equalsIgnoreCase(cornerStyle))
                        radiusCss = "24px";

                String spacingCss = "4rem"; // Comfortable
                if ("compact".equalsIgnoreCase(sectionSpacing))
                        spacingCss = "2rem";
                if ("spacious".equalsIgnoreCase(sectionSpacing))
                        spacingCss = "8rem";

                // Build Dynamic Structure based on Order
                StringBuilder structurePrompt = new StringBuilder();
                structurePrompt.append("### Structure & Content (Follow strictly order below)\n");
                structurePrompt.append(
                                "- **Navbar**: Sticky header. Logo (Name). Links (Home, Skills, Work, Contact).\n\n");
                structurePrompt.append(
                                "- **Hero Section**: Full height. Big Bold Name. Animated typing effect for Role. 'View Work' CTA button. (If PROFILE_IMAGE_SRC provided, show it here)\n\n");

                java.util.List<String> order = sectionOrder;
                if (order == null || order.isEmpty()) {
                        order = java.util.Arrays.asList("Skills", "Experience", "Projects");
                }

                for (String section : order) {
                        if ("Skills".equalsIgnoreCase(section)) {
                                structurePrompt.append("- **Skills Section**: Grid of 'Skill Pills' or Cards.\n");
                        } else if ("Experience".equalsIgnoreCase(section)) {
                                structurePrompt.append("- **Experience Section**: Vertical timeline or clean cards.\n");
                        } else if ("Projects".equalsIgnoreCase(section)) {
                                structurePrompt.append(
                                                "- **Projects Section**: Grid of Cards. Each card has Title, Description, and 'View Project' link.\n");
                        }
                }
                structurePrompt.append(
                                "\n- **Contact Section**: Minimalist form (styled only) + Social icons/links.\n\n");
                structurePrompt.append("- **Footer**: Simple copyright + 'Generated by PortfolioAI'.\n");

                return String.format(
                                "Act as an Expert Frontend Designer & Developer.\n" +
                                                "Create a Single-Page Portfolio Website for a %s.\n" +
                                                "\n" +
                                                "### Candidate Profile\n" +
                                                "- Name: %s\n" +
                                                "- Contact: Email: %s, Phone: %s, LinkedIn: %s, GitHub: %s\n" +
                                                "- Skills: %s\n" +
                                                "- Experience: %s\n" +
                                                "- Projects: %s\n" +
                                                "\n" +
                                                "%s\n" +
                                                "\n" +
                                                "### Technical Requirements\n" +
                                                "1. **Single HTML File**: Embedded CSS (<style>) and JS (<script>).\n" +
                                                "2. **Responsive**: Mobile-first approach using Flexbox/Grid.\n" +
                                                "3. **CSS Variables & Customization**: \n" +
                                                "   :root {\n" +
                                                "     --primary: %s;\n" +
                                                "     --bg-base: %s;\n" +
                                                "     --glass-bg: rgba(255, 255, 255, 0.05);\n" +
                                                "     --glass-border: rgba(255, 255, 255, 0.1);\n" +
                                                "     --text-main: %s;\n" +
                                                "     --text-muted: %s;\n" +
                                                "     --font-main: '%s', sans-serif;\n" +
                                                "     --border-radius: %s;\n" +
                                                "     --section-spacing: %s;\n" +
                                                "   }\n" +
                                                "   body { %s; color: var(--text-main); font-family: var(--font-main); }\n"
                                                +
                                                "4. **Font Integration**: Include Google Fonts links for the selected style.\n"
                                                +
                                                "\n" +
                                                "%s\n" + // Injected Structure
                                                "\n" +
                                                "### Special Instructions\n" +
                                                "- Use `backdrop-filter: blur(12px)` for glass effects if applicable.\n"
                                                +
                                                "- Ensure text contrast is high.\n" +
                                                "- Use `var(--border-radius)` for all cards/buttons and `var(--section-spacing)` for padding.\n"
                                                +
                                                "- If `PROFILE_IMAGE_SRC` is provided, use it in the Hero section.\n" +
                                                "- **IMPORTANT**: You MUST output the sections in the EXACT order specified in the Structure & Content section above.\n"
                                                +
                                                "- **Output ONLY valid HTML code**. No markdown blocks.",
                                role, name, email, phone, linkedin, github, skills, experience, projects,
                                templateInstructions,
                                themeColor, bgBase, textMain, textMuted, fontStyle, radiusCss, spacingCss, bgCss,
                                structurePrompt.toString());
        }

        public static String buildReactPrompt(String role, String skills, String experience, String projects,
                        String name, String email, String phone, String linkedin, String github, String themeColor,
                        String fontStyle, String backgroundStyle, String sectionSpacing, String cornerStyle,
                        String template, java.util.List<String> sectionOrder) {

                // Re-use logic for template instructions (simplified for brevity or copied)
                String templateInstructions = "";
                // ... (Logic could be extracted to helper, but for now we keep it here or just
                // ask for general React best practices with Tailwind)
                // For React, we rely on Tailwind classes more than custom CSS vars for
                // everything, but we can still ask for them.

                // Build Dynamic Structure
                StringBuilder structurePrompt = new StringBuilder();
                structurePrompt.append("### Structure & Content (Follow strictly order below)\n");
                structurePrompt.append("1. **Navbar**: Sticky, Links to sections.\n");
                structurePrompt.append("2. **Hero**: Intro, Name, Role.\n");

                java.util.List<String> order = sectionOrder;
                if (order == null || order.isEmpty()) {
                        order = java.util.Arrays.asList("Skills", "Experience", "Projects");
                }
                int i = 3;
                for (String section : order) {
                        structurePrompt.append(i++).append(". **").append(section).append(" Section**.\n");
                }
                structurePrompt.append(i).append(". **Contact Section**.\n");
                structurePrompt.append((i + 1)).append(". **Footer**.\n");

                return String.format(
                                "Act as an Expert React Developer.\n" +
                                                "Generate a complete React + Tailwind CSS portfolio project for a %s.\n"
                                                +
                                                "\n" +
                                                "### Candidate Profile\n" +
                                                "- Name: %s\n" +
                                                "- Contact: %s, %s, %s, %s\n" +
                                                "- Skills: %s\n" +
                                                "- Experience: %s\n" +
                                                "- Projects: %s\n" +
                                                "\n" +
                                                "### Requirements\n" +
                                                "1. **Tech Stack**: React (Vite structure), Tailwind CSS, Framer Motion (for animations), Lucide React (icons).\n"
                                                +
                                                "2. **Styling**: \n" +
                                                "   - Template Style: %s\n" +
                                                "   - Theme Color: %s\n" +
                                                "   - Font: %s\n" +
                                                "   - Corner Radius: %s\n" +
                                                "3. **Structure**: \n" +
                                                "%s\n" +
                                                "\n" +
                                                "### Output Format\n" +
                                                "Return a JSON object where keys are file paths and values are file contents. \n"
                                                +
                                                "Include these files:\n" +
                                                "- `src/App.jsx`\n" +
                                                "- `src/index.css` (with Tailwind imports)\n" +
                                                "- `src/components/Navbar.jsx`\n" +
                                                "- `src/components/Hero.jsx`\n" +
                                                "- `src/components/Skills.jsx`\n" +
                                                "- `src/components/Experience.jsx`\n" +
                                                "- `src/components/Projects.jsx`\n" +
                                                "- `src/components/Contact.jsx`\n" +
                                                "- `src/components/Footer.jsx`\n" +
                                                "- `package.json`\n" +
                                                "- `tailwind.config.js`\n" +
                                                "- `vite.config.js`\n" +
                                                "\n" +
                                                "**IMPORTANT**: Output ONLY valid JSON. No markdown blocks.",
                                role, name, email, phone, linkedin, github, skills, experience, projects,
                                template, themeColor, fontStyle, cornerStyle,
                                structurePrompt.toString());
        }
}
