from os import walk, path, listdir, getenv
from pathlib import Path as Path_lib
import json
# from model import getData, setData
from dotenv import load_dotenv
load_dotenv()


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
                if dir.startswith("suit"):
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
                if dir.startswith("suit"):
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


def getSuit(location):
    try:
        return listdir(location)
    except:
        return []


def get_hierarchy_bottom2up(location):
    dump = []
    for root, dir, files in walk(location):
        for file in files:
            if file.endswith(".feature"):
                dump.append(path.join(root, file))
    return dump


def get_hierarchy_by_address(location):
    address_list = get_hierarchy_bottom2up(location)
    hierarchy = {}
    req_id = ''
    test_suit_list = []
    for address in address_list:
        with open(address) as f:
            lines = f.readlines()
            for line in lines:
                if "reqId" in line:
                    req_id = line.split("=")[
                        1].strip()

        head, tail = path.split(address)
        file_name = tail
        test_case_name = ''
        test_suit = ''
        if path.isdir(head):
            test_case_name = path.basename(head)
            dir_name = path.dirname(head)  # without basename/ till parent dir
            test_suit = path.basename(dir_name)
            test_suit_list.append(test_suit)

        if test_suit not in hierarchy:
            hierarchy[test_suit] = {}
        hierarchy[test_suit][test_case_name] = {
            "feature": file_name, "req_id": req_id, "path": head}
    test_suit_list = [*set(test_suit_list)]  # removing duplicates
    return hierarchy, test_suit_list


def main():
    location = getenv("PYTHON_BASE_ADDRESS")
    hierarchy, suit_list = get_hierarchy_by_address(location)
    # Step 1 : Reading test suit Name
    print('Step 1: Reading test suit name from: ', location, '\n')
    # payload = getSuit(location)  # array format

    # Step 2 : Writing test suit in the testSuit.json file
    print("Available Test Suit \n", suit_list, "\n")
    # testSuit_json = json.dumps(payload)
    with open('test_suit.json', 'w') as f:
        json.dump(suit_list, f)

    # Step 3 : Reading test suit, test case and req id hierarchically
    # resp2 = create_dir_tree_dict(location)
    resp2 = hierarchy
    dir_hierarchy = json.dumps(resp2, indent=2)
    print("Reading directory hierarchy")
    print(dir_hierarchy)

    # Step 4: Saving hierarchy in dir_hierarchy file
    with open('dir_hierarchy.json', 'w') as f:
        json.dump(resp2, f)

    response = getReqID(location)
    new_response = ReqIdMapping(response)
    with open('reqID_mapping.json', 'w') as f:
        json.dump(new_response, f)
    print(new_response)
    print("\n\nProcess end \n")

    # response = json.dumps(response, indent=2)
    # print('JSON Response', response)
    # resp2 = create_dir_tree_dict(location)
    # resp2 = getReqIDTest(location)
    # print('json 2', json.dumps(resp2, indent=2))
    # result = [new_response, resp2]
main()
