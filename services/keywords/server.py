#-*- encoding:utf-8 -*-
from __future__ import print_function

import sys
try:
    reload(sys)
    sys.setdefaultencoding('utf-8')
except:
    pass

from http.server import BaseHTTPRequestHandler, HTTPServer
import ast, json, re, base64
from test import Keywords

class S(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

    def do_GET(self):
        self._set_headers()
        self.wfile.write("<html><body><h1>hi!</h1></body></html>")

    def do_HEAD(self):
        self._set_headers()

    def do_POST(self):
        # Doesn't do anything with posted data
        self._set_headers()
        print('request ...')
        w = Keywords()
        self.wfile.write(str.encode(json.dumps(w)))

if __name__ == "__main__":
    from sys import argv
    server_address = ('', 4004)
    httpd = HTTPServer(server_address, S)
    print('Starting httpd...')
    httpd.serve_forever()

