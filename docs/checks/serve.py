# Serves a Next static export like GitHub Pages: /a/b -> a/b.html, / -> index.html, anything missing
# -> 404.html with status 404. Usage: serve.py <dir> <port>
import http.server, os, sys
root, port = sys.argv[1], int(sys.argv[2])
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=root, **k)
    def log_message(self, *a): pass
    def translate_path(self, path):
        p = super().translate_path(path.split("?")[0]).rstrip("/")
        if os.path.isfile(p + ".html"): return p + ".html"
        if os.path.isdir(p) and os.path.exists(os.path.join(p, "index.html")): return os.path.join(p, "index.html")
        return p
    def send_error(self, code, message=None, explain=None):
        page = os.path.join(root, "404.html")
        if code != 404 or not os.path.isfile(page): return super().send_error(code, message, explain)
        body = open(page, "rb").read()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD": self.wfile.write(body)
http.server.ThreadingHTTPServer(("127.0.0.1", port), H).serve_forever()
