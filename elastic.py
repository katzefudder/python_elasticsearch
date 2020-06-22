#!/usr/bin/env python3 
#-*- coding: utf-8 -*- 
from elasticsearch import Elasticsearch, helpers 
import os, uuid, json

elastic = Elasticsearch([
    {'host': 'es01'},
])

'''
this function opens a json file and returns its contents as a dict
'''
def get_data_from_file(path):
    with open(path) as json_file:
        data = json.load(json_file)

    json_file.close()
    return data

'''
generator to push bulk data from a JSON
file into an Elasticsearch index
'''
def bulk_json_data(json_file, _index):
    json_list = get_data_from_file(json_file)
    for k,v in json_list.items():
        if v['exif']['filename']:
            doc = {
                "filename" : str(v['exif']['filename']),
                "caption": str(v['iptc']['Caption']),
                "headline": str(v['iptc']['Headline']),
                "keywords": v['iptc']['Keywords'],
            }

            # yield a dict
            yield {
                "_index": _index,
                "_id": str(v['exif']['filename']), # use filename as ID
                "_source": json.dumps(doc),
            }
try:
    # make the bulk call, and get a response
    response = helpers.bulk(elastic, bulk_json_data("meta.json", "galleries"))
    print ("\nbulk_json_data() RESPONSE:", response)
except Exception as e:
    print("\nERROR:", e)