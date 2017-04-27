
import os,sys,re
from PIL import Image

tiles = """
	floor		1647 400
	passage 	1034 463
	rock		1420 427
	player		1077 48
	treasure	1391 1462
	gold 		563 686
	frame 		1843 496
	stairsd		488 498
	stairsu 	1355 496
	pit			1581 402
	door 		562 497
	snake		1108 144
	dragon		80 114
	nuibus		880 174
	wyvern		496 175
	spider		272 141
	grue		790 176

""".replace("\t"," ").split("\n")

img = Image.open("tiles.png")
for t in tiles:
	if t.strip() != "":
		m = re.match("^\\s*([a-z]+)\\s*(\d+)\\s*(\d+)\\s*$",t)
		assert m is not None,"error "+t
		x = int(int(m.group(2))/32)*32
		y = int(int(m.group(3))/32)*32
		name = "source"+os.sep+m.group(1).lower()+".png"
		#print(name,x,y)
		newImg = img.crop((x,y,x+32,y+32))
		newImg.save(name)
