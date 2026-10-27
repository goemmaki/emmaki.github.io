# Serves a Next static export: /a/b -> a/b.html, / -> index.html. Usage: serve.py <dir> <port>
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
http.server.ThreadingHTTPServer(("127.0.0.1", port), H).serve_forever()
