from os import walk, path, listdir
from pathlib import Path as Path_lib
import json
from model import getData, setData


def getReqID(location):
    try:
        payload = []
        for (dirPath, dirNames, fileNames) in walk(location):
            for file in fileNames:
                if file.endswith(".feature"):
                    with open(path.join(dirPath, file)) as f:
                        lines = f.readlines()
                        for line in lines:
                            if "reqId" in line:
                                payload.append(
                                    {"dir_path": dirPath, "file_name": file, "req_id": line.split("=")[1].strip()})

        return payload
    except:
        return []


def create_dir_tree_dict(root_dir: str):
    """
    Create a directory tree in a dictionary format
    """
    dir_tree_dict = {}
    for item in listdir(root_dir):
        item_path = path.join(root_dir, item)
        if path.isdir(item_path):
            dir_tree_dict[item] = create_dir_tree_dict(item_path)
        else:
            # dir_tree_dict[item] = None
            if ".feature" in item:
                # print('feature file', item)
                with open(item_path) as f:
                    lines = f.readlines()
                    for line in lines:
                        if "reqId" in line:
                            dir_tree_dict['req_id'] = line.split("=")[
                                1].strip()

    return dir_tree_dict


def suitHierarchy(location):
    try:
        payload = []
        dic = {}
        for (dirPath, dirNames, fileNames) in walk(location):
            for dir in dirNames:
                if dir.startswith("suite"):
                    # obj = {}
                    dic[dir] = {}
                    # payload.append(dic)
                if dir.startswith("tst"):
                    for suitName in dic.keys():
                        if suitName in dirPath:
                            obj = {}
                            obj[dir] = {"req_id": 'xx'}
                            dic[suitName] = obj

        # print('dic', dic)
        payload.append(dic)
        return payload

    except Exception as err:
        print(err)


def getReqIDTest(location):
    try:
        payload = []
        dic = {}
        for (dirPath, dirNames, fileNames) in walk(location):
            for dir in dirNames:
                if dir.startswith("suite"):
                    dic[dir] = []
                if dir.startswith("tst"):
                    for suitName in dic.keys():
                        dic[suitName] = dirNames
                        # if dic[suitName]:
                        #     print('directory name', dirNames)
                        #     dic[suitName] = dirNames

        # print(dic)

        return dic
    except Exception as e:
        print(e)
        return []


def ReqIdMapping(response):
    new_response = {}
    for elem in response:
        parent_dir = elem['dir_path'].replace(
            path.dirname(elem['dir_path'])+"\\", '')
        keys = new_response.keys()
        if str(elem['req_id']) in keys:
            arr = new_response[str(elem['req_id'])]
        else:
            arr = []
        arr.append(parent_dir)
        new_response[str(elem['req_id'])] = arr
    return new_response


def getSuite(location):
    try:
        return listdir(location)
    except:
        return []


def main():
    location = "D:\\projects\\broker-server\\broker\\w_poc_2"
    # location = input("Please write test suite directory path.\n")

    # Step 1 : Reading test suite Name
    print('Step 1: Reading test suite name from: ', location, '\n')
    payload = getSuite(location)  # array format

    # Step 2 : Writing test suite in the testSuite.json file
    print("Available Test Suites \n", payload, "\n")
    testSuite_json = json.dumps(payload)
    with open('test_suite.json', 'w') as f:
        json.dump(testSuite_json, f)

    # Step 3 : Reading test suite, test case and req id hierarchically
    resp2 = create_dir_tree_dict(location)
    dir_hierarchy = json.dumps(resp2, indent=2)
    print("Reading directory hierarchy")
    print(dir_hierarchy)

    # Step 4: Saving hierarchy in dir_hierarchy file
    with open('dir_hierarchy.json', 'w') as f:
        json.dump(resp2, f)

    print("\n\nProcess end \n")

    # response = getReqID(location)
    # new_response = ReqIdMapping(response)
    # response = json.dumps(response, indent=2)
    # print('JSON Response', response)
    # resp2 = create_dir_tree_dict(location)
    # resp2 = getReqIDTest(location)
    # print('json 2', json.dumps(resp2, indent=2))
    # result = [new_response, resp2]
main()
