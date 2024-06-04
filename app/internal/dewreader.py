import os
import logging
import uvicorn

logger = logging.getLogger('uvicorn')

class mapReader(object):
    
    def __init__(self, mapfile, contents):
        mapName = None
        mapDescription = None
        mapAuthor = None
        mapId = None
        mapScnrObjectCount = None
        mapTotalObjectCount = None
        mapBudgetCount = None
        gameVersion = None

        self.mapFile = mapfile
        self.contents = contents
        self.read()

    def byte2ascii(self, hval):
        ascii_object = hval.decode("utf-8", errors="ignore").replace(u"\u0000", "")

        return ascii_object

    def byte2int(self, hval):
        int_object = int.from_bytes(hval, "little")

        return int_object


    def read(self):
        #Create a file object from our byte stream
        logger.info("Scanning map file #############################")
        with open(self.mapFile, "w+b") as f:
            f.write(self.contents)

            #Verify the map file size and headers
            size = f.tell()
            f.seek(0x0000, 0)

            if size == 61440 and self.byte2ascii(f.read(4)) == "_blf":
                f.seek(0x0278, 0)
                sig = self.byte2ascii(f.read(1))

                #This one byte seems to be in 0.5 maps but not in 0.6 so we ball
                if sig in (")"):
                    self.gameVersion = "0.5.1"
                
                else:
                    self.gameVersion = "0.6.1"
        
            elif size <= 134000 and self.byte2ascii(f.read(4)) == "flb_":
                self.gameVersion = "0.7.1"

            else:
                return 2

            #Map name
            f.seek(0x0048, 0)
            self.mapName = self.byte2ascii(f.read(32))
            self.mapName.encode('ascii', 'ignore')

            logger.info("######################################")
            logger.info(self.mapName)

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
            
            if not self.mapScnrObjectCount:
                self.mapScnrObjectCount = None
    
            #Total Objects
            f.seek(0x0244, 0)
            self.mapTotalObjectCount = self.byte2int(f.read(2))

            #Budget
            f.seek(0x0246, 0)
            self.mapBudgetCount = self.byte2int(f.read(2))

            #Cleanup
            f.close()


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
        ascii_object = hval.decode("utf-8", errors="ignore").replace(u"\u0000", "")

        return ascii_object

    def byte2int(self, hval):
        int_object = int.from_bytes(hval, "little")

        return int_object

    def read(self):
        #Create a file object from our byte stream
        with open(self.variantFile, "w+b") as f:
            f.write(self.contents)

            #Verify the variant file size since they are static
            size = f.tell()
            if size != 4096:
                return 1
        
            if size == 0:
                return 2

            #Variant name
            f.seek(0x0048, 0)
            self.variantName = self.byte2ascii(f.read(32))
            self.variantName.encode('ascii', 'ignore')

            #Variant description
            f.seek(0x0068, 0)
            self.variantDescription = self.byte2ascii(f.read(64))

            #Variant author
            f.seek(0x00E8, 0)
            self.variantAuthor = self.byte2ascii(f.read(16))

            #Variant ID
            f.seek(0x0228, 0)
            self.variantId = self.byte2int(f.read(4))

            #Cleanup
            f.close()


class prefabReader(object):
    prefabName = None
    prefabAuthor = None
    prefabDescription = None
    prefabId = None

    def __init__(self, prefabfile, contents):
        self.prefabFile = prefabfile
        self.contents = contents
        self.read()

    def byte2ascii(self, hval):
        ascii_object = hval.decode("utf-8", errors="ignore").replace(u"\u0000", "")

        return ascii_object

    def byte2int(self, hval):
        int_object = int.from_bytes(hval, "little")

        return int_object

    def read(self):
        #Create a file object from our byte stream
        with open(self.prefabFile, "w+b") as f:
            f.write(self.contents)

            #Verify the file size (Prefabs can be an unknown size but not zero)
            size = f.tell()

            #Check that we have at least some data        
            if size < 32:
                return 1

            #Arbitrary limit size I set because prefabs "shouldnt" be larger than this?
            elif size > 26214400:
                return 1

            #Prefab name
            f.seek(0x0010, 0)
            self.prefabName = self.byte2ascii(f.read(16))
            self.prefabName.encode('ascii', 'ignore')

            #Prefab author
            f.seek(0x0020, 0)
            self.prefabAuthor = self.byte2ascii(f.read(16))

            #Cleanup
            f.close()

class modReader(object):
    modDescription = None
    modAuthor = None
    modId = None
    modFileSize = None

    def __init__(self, modfile, contents):
        self.modFile = modfile
        self.modName = os.path.splitext(modfile)[0]
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
        with open(self.modFile, "w+b") as f:
            f.write(self.contents)

            #Verify the file size (Mods can be an unknown size but not zero)
            size = f.tell()
            self.modFileSize = size

            #Check that we have at least some data        
            if size < 32:
                return 1

            #Arbitrary limit size I set for mods at 4gb
            elif size > 4294967296:
                return 2

            #Mod name
            f.seek(0x4AC, 0)
            self.modName = self.byte2ascii(f.read(64))
            #self.modName.encode('ascii', 'ignore')

            #Mod Author
            f.seek(0x4EC, 0)
            self.modAuthor = self.byte2ascii(f.read(32))

            #Mod description
            f.seek(0x50c, 0)
            self.modDescription = self.byte2ascii(f.read(512))

            #Cleanup
            f.close()
