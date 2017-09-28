#-*- encoding:utf-8 -*-
from collections import Counter,defaultdict
import codecs
import math
import numpy as np
from .utils import AttrDict, get_default_stop_words_file

delimiters = ['?', '!', ';', '？', '！', '。', '；', '……', '…', '\n']
stop_words    = []
unique_list   = lambda x,y:x if y in x else x + [y]
d = 0.85
iter_no = 100

class KeyWord(object):

  def __init__(self):
    self.text = ''
    self.tr = []
    self.stop_words = set()
    self.stop_words_file = get_default_stop_words_file()
    for word in codecs.open(self.stop_words_file, 'r', 'utf-8', 'ignore'):
        self.stop_words.add(word.strip())

  #
  def keywords(self, text, window=3, num=30):
    self.window = window
    self.num = num
    text = self.preprocess(text)
    graph = self.keywordGraph(text)
    tr = textRank(graph)
    return tr if num >= len(tr) else tr[:num]

  # 预处理
  def preprocess(self, text):
    # 分词
    text = text.split(' ')
    # print(text)
    # 去除空白
    text = [w for w in text if len(w)>0]
    # 去除停用词
    text = [word.strip() for word in text if word.strip() not in self.stop_words]
    # print ', '.join(text)
    return text

  # 关键词图
  def keywordGraph(self, word_list):
    window = self.window
    # 计数器, 统计每个单词出现频率
    data = defaultdict(Counter)
    for i,word in enumerate(word_list):
      # create window size
      indexStart = i - window
      indexEnd   = i + window
      # print 'begin', i, word, ", ".join(data[word])
      if indexStart < 0:
        temp = Counter(word_list[:window+i+1])
        temp.pop(word)
        data[word] += temp

      elif indexStart>=0 and indexEnd<=len(word_list):
        temp = Counter(word_list[i-window:i+window+1])
        temp.pop(word)
        data[word] += temp

      else:
        temp = Counter(word_list[i-window:])
        temp.pop(word)
        data[word]+=temp
      # print "[", word, "]", ", ".join(data[word])
      # print data[word]
    return data

# 排名
def textRank(graph, d=0.85):
  # 初始权值为 1.0
  TR = defaultdict(float,[(word, 1.) for word, cooc in graph.items()])
  # 收敛
  for i in range(iter_no):
    for word, cooc in graph.items():
      # print word, cooc
      temp = 0
      # 迭代更新分数
      for link_word, weight in cooc.items():
        in_vi = TR[link_word]
        out_vj = sum(graph[link_word].values())
        temp += in_vi * weight / out_vj
      TR[word] = 1 - d + d * temp

  return [AttrDict(word= word, weight=weight) for word,weight in sorted(TR.items(),key=lambda kv: (-kv[1], kv[0]),reverse=True)]

