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
from libs import Abstract

class S(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

    def do_GET(self):
        self._set_headers()
        self.wfile.write("<html><body><h1>hi!</h1></body></html>")

    def do_HEAD(self):
        self._set_headers()

    def do_POST(self):
        # Doesn't do anything with posted data
        self._set_headers()
        content_len = int(self.headers.get_all("content-length")[0])
        post_body = self.rfile.read(content_len)
        post_body = post_body.decode('utf8')
        text = base64.b64decode(post_body)
        w = Abstract()
        # print(text)
        rank = w.analyze(str(text))
        self.wfile.write(rank[0].encode())

if __name__ == "__main__":
    from sys import argv
    server_address = ('', 4004)
    httpd = HTTPServer(server_address, S)
    print('Starting httpd...')
    httpd.serve_forever()

