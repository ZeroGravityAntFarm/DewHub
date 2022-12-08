import os

class mapReader(object):
    mapName = None
    mapDescription = None
    mapAuthor = None
    mapId = None
    scnrObjectCount = None
    mapTotalObjectCount = None
    mapBudgetCount = None

    def __init__(self, mapfile, contents):
        self.mapFile = mapfile
        self.contents = contents
        self.read()

    def byte2ascii(self, hval):
        ascii_object = hval.decode("utf-8").replace(u"\u0000", "")

        return ascii_object

    def byte2int(self, hval):
        int_object = int.from_bytes(hval, "little")

        return int_object


    def read(self):
        #Create a file object from our byte stream
        with open(self.mapFile, "w+b") as f:
            f.write(self.contents)

            #Verify the map file size since they are static
            size = f.tell()
            if size != 61440:
                return 1
        
            if size == 0:
                return 2

            #Map name
            f.seek(0x0048, 0)
            self.mapName = self.byte2ascii(f.read(32))
            self.mapName.encode('ascii', 'ignore')

            #Map description
            f.seek(0x0068, 0)
            self.mapDescription = self.byte2ascii(f.read(128))

            #Map author
            f.seek(0x00E8, 0)
            self.mapAuthor = self.byte2ascii(f.read(16))

            #Map ID
            f.seek(0x0228, 0)
            self.mapId = self.byte2int(f.read(4))

            #Object Data
            f.seek(0x0242, 0)
            self.mapScnrObjectCount = self.byte2int(f.read(2))
    
            #Total Objects
            f.seek(0x0244, 0)
            self.mapTotalObject = self.byte2int(f.read(2))

            #Budget
            f.seek(0x0246, 0)
            self.mapBudgetCount = self.byte2int(f.read(2))

            #Cleanup
            f.close()

        '''
        dataDict["mapName"] = self.mapName
        dataDict["mapAuthor"] = self.mapAuthor
        dataDict["mapDescription"] = self.mapDescription
        dataDict["mapId"] = self.mapId
        dataDict["mapScnrObjectCount"] = self.mapScnrObjectCount
        dataDict["mapTotalObject"] = self.mapTotalObject
        dataDict["mapBudgetCount"] = self.mapBudgetCount
        dataDict["mapFile"] = self.mapFile

        self.Dict = dataDict'''

        


class variantReader(object):
    variantName = None
    variantAuthor = None
    variantDescription = None
    variantId = None

    def __init__(self, variantfile, contents):
        self.variantFile = variantfile
        self.contents = contents
        self.read()

    def byte2ascii(self, hval):
        ascii_object = hval.decode("utf-8")

        return ascii_object

    def byte2int(self, hval):
        int_object = int.from_bytes(hval, "little")

        return int_object

    def read(self):
        #Create a file object from our byte stream
        with open(self.variantFile, "w+b") as f:
            f.write(self.contents)

            #Verify the map file size since they are static
            size = f.tell()
            if size != 4096:
                return 1
        
            if size == 0:
                return 2

            #Map name
            f.seek(0x0048, 0)
            self.variantName = self.byte2ascii(f.read(32))
            self.variantName.encode('ascii', 'ignore')

            #Map description
            f.seek(0x0068, 0)
            self.variantDescription = self.byte2ascii(f.read(64))

            #Map author
            f.seek(0x00E8, 0)
            self.variantAuthor = self.byte2ascii(f.read(16))

            #Map ID
            f.seek(0x0228, 0)
            self.variantId = self.byte2int(f.read(4))

            #Cleanup
            f.close()