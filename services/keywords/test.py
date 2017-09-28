#-*- encoding:utf-8 -*-
from __future__ import print_function

import sys
try:
    reload(sys)
    sys.setdefaultencoding('utf-8')
except:
    pass

import codecs,re, nltk, pymongo


# loadfile
text1 = codecs.open('./test/01.txt', 'r', 'utf-8').read()
text2 = codecs.open('./test/02.txt', 'r', 'utf-8').read()
text3 = codecs.open('./test/03.txt', 'r', 'utf-8').read()
stopwords = codecs.open('stopwords.txt', 'r', 'utf-8').read().split('\n')

# product / company name
words = codecs.open('words.txt', 'r', 'utf-8').read().split('\n')
words.pop()
seg_word = 'bbbbb-'
for i in range(len(words)):
  item = words[i].split(',')
  if (len(item) == 1):
    handle = seg_word + words[i].split(' ')[0] + "-" + words[i].split(' ')[1]
    words[i] = [words[i], handle]
  else:
    words[i] = item

client = pymongo.MongoClient(['127.0.0.1:27017'])
db = client.get_database("shareading")
coll = db.get_collection("articles")
articles = list(coll.find({}, {"url":1, "origin_content": 1}))
# print(articles)
pass

# source
# textArr = [text1,text3,text3]
textArr = [x["origin_content"] for x in articles]
wordDict = {}

# compute
for i in range(len(textArr)):
  text = textArr[i]
  text = re.sub(r'</?\w+[^>]*>','',text)
  text = re.sub(r"[\!\/_$%^*(+\"\')]+","",text)
  text = re.sub(r'\\x[a-zA-Z0-9]{2}', '', text)
  for k in words:
    text = text.replace(k[0], k[1])
  text = nltk.word_tokenize(text)
  text = [x for x in text if x.lower() not in stopwords and x != " "]
  for word in text:
    if word not in wordDict:
      wordDict[word] = [i]
    else:
      wordDict[word].append(i)
  # print(text)
wordDict = sorted(wordDict.items(),key=lambda kv: (len(kv[1])),reverse=True)[:100]
ne = nltk.ne_chunk(nltk.pos_tag([k[0] for k in wordDict]))
# print(ne)
pos = [ 'NNP', 'VBZ']
ne_list = []
for i in range(len(ne)):
  item = ne[i]
  item = re.sub(r'[()\]\[\'\>\<]+','',str(item)).split(',')
  # 已经识别, 切除切除
  # print(item)
  if(len(item) == 1):
    item = item[0].split('/')[0].split(' ')[1]
    ne_list.append(item)
  # 区分词性
  elif item[1].replace('\'', '').strip() in pos:
    ne_list.append(item[0])
  elif item[0].startswith(seg_word):
    ne_list.append(item[0].replace(seg_word, ''))

ne_list = [x for x in ne_list if x != '']
print(ne_list)
