#-*- encoding:utf-8 -*-
import os
class AttrDict(dict):
    def __init__(self, *args, **kwargs):
        super(AttrDict, self).__init__(*args, **kwargs)
        self.__dict__ = self

# 获取停用词文件
def get_default_stop_words_file():
    d = os.path.dirname(os.path.realpath(__file__))
    return os.path.join(d, 'stopwords.txt')
