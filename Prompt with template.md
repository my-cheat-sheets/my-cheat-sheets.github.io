Instructions for Creating a New Cheat Sheet
Role: Expert Technical Documentation Developer Task: Create a new cheat sheet HTML file for [Subject Name] in the
my-cheat-sheets.github.io project.

File Location & Naming:

Languages: cheats/languages/[name].html (e.g., python.html)
Tools: cheats/tools/[name].html (e.g.,
terraform.html
)
Naming Convention: Use lowercase with underscores or hyphens if needed.
Required HTML Structure:

Skeleton: Use a minimal HTML5 boilerplate.
html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>[Subject] Complete Cheatsheet</title>
</head>

<body>
    <!-- Content goes here -->
</body>

</html>
Note: Do not include external CSS
<link> tags; styles are handled globally.
Main Header:
Inside

<body>, start with an <h1> containing a relevant emoji and the title.
        Example: <h1>⚡ JavaScript Complete Cheatsheet</h1>
        Content Sections (<details>):
            Group content into collapsible <details> sections.
                Crucial: The first <details> element must have the open attribute so it is expanded by default.
                    Summary: Use a <summary> tag with an emoji and the section title.
                        Example:
                        html
                        <details open>
                            <summary>🚀 Basics & Syntax</summary>
                            <!-- specific content -->
                        </details>
                        <details>
                            <summary>📦 Advanced Concepts</summary>
                            <!-- specific content -->
                        </details>
                        List Items & Code Blocks:
                        Use an Unordered List <ul> for the items inside a section.
                            Each item should be an <li> containing the Title followed immediately by a
                                <pre><code> block.
                                Format:
                                html
                                <ul>
                                <li>Variable Declaration
                                    <pre><code>const x = 10;
                                let y = 20;</code></pre>
                            </li>
                            <li>Another Concept
                                <pre><code>// Code example here</code></pre>
                            </li>
                        </ul>
                        Standard Sections:
                        Include a References section near the end with links to official docs.
                        Include a Setup & Verification section at the very end with a simple CLI command to check the
                        installation (e.g., node -v).
                        Example Template:

                        html
                        <!DOCTYPE html>
                        <html lang="en">

                        <head>
                            <meta charset="UTF-8">
                            <title>New Tool Cheatsheet</title>
                        </head>

                        <body>
                            <h1>🛠️ New Tool Cheatsheet</h1>
                            <details open>
                                <summary>🚀 Core Commands</summary>
                                <ul>
                                    <li>Init Project
                                        <pre><code>tool init my-app</code></pre>
                                    </li>
                                </ul>
                            </details>
                            <!-- other sections with close only first into and last refetace is default open-->
                            <details open>
                                <summary>📚 References</summary>
                                <h2>References</h2>
                                <ul>
                                    <button><a href="#" target="_blank">Official Documentation</a></button>
                                </ul>
                            </details>
                        </body>

                        </html>