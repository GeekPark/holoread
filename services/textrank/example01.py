#-*- encoding:utf-8 -*-
from __future__ import print_function

import sys
try:
    reload(sys)
    sys.setdefaultencoding('utf-8')
except:
    pass

import codecs
from libs import KeyWord

text = codecs.open('./test/02.txt', 'r', 'utf-8').read()
w = KeyWord()
rank = w.analyze(text)

for item in rank:
   print(item.word, item.weight)
