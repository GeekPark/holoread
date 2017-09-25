#-*- encoding:utf-8 -*-
import jieba.posseg as pseg
from collections import Counter,defaultdict
import codecs
import math
import numpy as np
import re
from .KeyWord import KeyWord


class Abstract(object):
  def __init__(self):
    self.text = ''

  #
  def analyze(self, text):
    sentence = preprocess(text)
    graph = sentence_graph(sentence)
    result = abstract_rank(graph)
    return result

# 本文预处理
def preprocess(text):
  text = re.sub(r'</?\w+[^>]*>','',text)
  print(text)
  docs = text.split('.')
  sentence_kw = defaultdict(list)
  for sen in docs:
    # 去除空白
    sen = " ".join(sen.split())
    w = KeyWord()
    rank = w.keywords(sen)
    keywords = [item.word for item in rank]
    sentence_kw[sen] = keywords

  return sentence_kw

# 句子依赖关系
def sentence_graph(sentence_kw):
  cooc_dict = defaultdict(dict)
  for sentence,kw in sentence_kw.items():
    temp = {}
    for sent_check, kw_check in sentence_kw.items():
      temp[sent_check] = len([word for word in kw if word in kw_check])
    cooc_dict[sentence] = temp
  return cooc_dict

def abstract_rank(graph, d=0.85, sent_num=3):
  TR = defaultdict(float,[(sent,np.random.rand()) for sent,_ in graph.items()])
  err = 1e-5
  error = 1
  iter_no = 100
  index = 1
  while (iter_no > index and  error > err):
    error = 0
    TR_copy = TR.copy()
    for sent,cooc in graph.items():
        temp = 0
        for link_sent,weight in cooc.items():
          t = sum(graph[link_sent].values())
          t = 1 if t == 0 else t
          temp += TR[link_sent] * weight / t
        TR[sent] = 1 - d + d * temp
    error += (TR[sent] - TR_copy[sent])**2
    index += 1
  ks = [sent for sent,weight in sorted(TR.iteritems(),key=lambda (k,v):(v,k),reverse=True)[:sent_num]]
  return ks
