#!/usr/bin/env python3
"""
Local development server for jcoursework-portfolio.
Mimics GitHub Pages behavior: serves static files, falls back to 404.html for unknown paths.

Usage: python3 serve.py
Then open http://localhost:8000
"""

import http.server
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Check if the requested path maps to an actual file
        path = self.translate_path(self.path)

        if os.path.isfile(path):
            # Serve the file normally
            return super().do_GET()
        elif os.path.isdir(path) and os.path.isfile(os.path.join(path, 'index.html')):
            # Serve index.html for directories
            return super().do_GET()
        else:
            # Serve 404.html for unknown paths (like GitHub Pages)
            self.path = '/404.html'
            return super().do_GET()

if __name__ == '__main__':
    with http.server.HTTPServer(('', PORT), PortfolioHandler) as httpd:
        print(f'Serving at http://localhost:{PORT}')
        print('Press Ctrl+C to stop')
        httpd.serve_forever()
