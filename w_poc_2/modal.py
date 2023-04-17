import mysql.connector

dataBase = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="",
    database="w_poc"
)

cursorObject = dataBase.cursor()

# query = "SELECT NAME FROM TEST_SUITE"
# cursorObject.execute(query)

# myresult = cursorObject.fetchall()

# for x in myresult:
#     print(x)


def setData(query, values):
    try:
        print('query>>', query, values)
        cursorObject.executemany(query, values)
        dataBase.commit()
        return True
    except Exception as err:
        print('error in setData', err)
        return False


def getData(query):
    cursorObject.execute(query)
    myresult = cursorObject.fetchall()
    return myresult
