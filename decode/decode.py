import re,os,sys

# ***************************************************************************************************************************************************
#															Class which tracks PET Basic tokens
# ***************************************************************************************************************************************************
class TokenManager:
	def __init__(self):
		self.tokens = {}																		# Pet BASIC tokens. 
		tokenText = """
			80:end,81:for,82:next,83:data,84:input#,85:input,86:dim,87:read,88:let,89:goto,8a:run,8b:if,8c:restore,8d:gosub,8e:return,8f:rem,
			90:stop,91:on,92:wait,93:load,94:save,95:verify,96:def,97:poke,98:print#,99:print,9a:cont,9b:list,9c:clr,9d:cmd,9e:sys,9f:open,
			a0:close,a1:get,a2:new,a3:tab(,a4:to,a5:fn,a6:spc(,a7:then,a8:not,a9:step,aa:+,ab:-,ac:*,ad:/,ae:^,af:and,b0:or,b1:>,b2:=,
			b3:<,b4:sgn,b5:int,b6:abs,b7:usr,b8:fre,b9:pos,ba:sqr,bb:rnd,bc:log,bd:exp,be:cos,bf:sin,c0:tan,c1:atn,c2:peek,c3:len,
			c4:str$,c5:val,c6:asc,c7:chr$,c8:left$,c9:right$,ca:mid$,cb:go,ff:pi
		""".replace(" ","").replace("\t","").replace("\n","")
		for pair in tokenText.split(","):														# convert to token value => text name.
			parts = pair.split(":")
			self.tokens[int(parts[0],16)] = parts[1].upper()

		self.charCodes = {}																		# Pet character equivalents for non PETSCII
		self.charCodes[192] = "HBar"
		self.charCodes[221] = "VBar"
		self.charCodes[147] = "Clr"
		self.charCodes[17] = "Down"
		self.charCodes[29] = "Right"
		self.charCodes[14]= "Home"

	def isToken(self,code):																		# True if token exists
		return code in self.tokens	
	def getToken(self,code):																	# Get token value
		return self.tokens[code]
	def getCharacterCode(self,code):															# Convert character code to displayable format
		if code in self.charCodes:
			return "{"+self.charCodes[code]+"}"
		else:
			return "{"+str(code)+"}"

class BaseRenderer:
	pass

# ***************************************************************************************************************************************************
#														Keyword Object
# ***************************************************************************************************************************************************

class KeywordToken(BaseRenderer):
	def __init__(self,token,parseInfo):
		self.token = parseInfo["tokeniser"].getToken(token) 
	def renderText(self,renderInfo):
		token = self.token[0].upper()+self.token[1:].lower()
		if len(token) > 0:
			token = " "+token+" "
		return token

# ***************************************************************************************************************************************************
#														Character Object
# ***************************************************************************************************************************************************

class CharacterToken(BaseRenderer):
	def __init__(self,character,parseInfo):
		self.character = character 
	def renderText(self,renderInfo):
		return self.character

# ***************************************************************************************************************************************************
#													  Quoted String Object
# ***************************************************************************************************************************************************

class StringToken(BaseRenderer):
	def __init__(self,chars,parseInfo):
		self.characters = ""
		for c in chars:
			oc = ord(c)			
			if oc == 32:
				c = "~"
			elif oc >= 32 and oc < 127:			
				c = c.lower()
			elif oc >= 65+128 and oc <= 65+25+128:
				c = chr(oc-128)
			else:
				c = parseInfo["tokeniser"].getCharacterCode(oc)
			self.characters = self.characters + c 

	def renderText(self,renderInfo):
		return '"'+self.characters+'"'

# ***************************************************************************************************************************************************
#														Variable Object
# ***************************************************************************************************************************************************

class VariableToken(BaseRenderer):
	def __init__(self,variable,parseInfo):
		self.variable = variable.lower()
	def renderText(self,renderInfo):
		return renderInfo["variableMapper"].vmap(self.variable)

# ***************************************************************************************************************************************************
#														Linenumber Object
# ***************************************************************************************************************************************************

class LineNumberToken(BaseRenderer):
	def __init__(self,lineNumber,parseInfo):
		self.lineNumber = lineNumber
	def renderText(self,renderInfo):
		return renderInfo["commentManager"].lmap(self.lineNumber)

# ***************************************************************************************************************************************************
#														Statement Object
# ***************************************************************************************************************************************************

class Statement(BaseRenderer):
	def __init__(self,statement,parseInfo):
		self.tokens = [] 																		# all tokens in this statement
		self.characteristic = "intelligence,intuition,ego,strength,constitution,dexterity".split(",")
		statement = statement.strip()
		while statement != "":																	# more to render.
			ch = ord(statement[0])
			if parseInfo["tokeniser"].isToken(ch):												# token
				self.tokens.append(KeywordToken(ch,parseInfo))									# add a keyword token
				isGoKeyword = ch == 0x89 or ch == 0x8D											# check if goto/gosub
				statement = statement[1:].strip() 												# remove, and strip.
				if isGoKeyword:
					while statement != "" and statement[0] >= "0" and statement[0] <= "9":		# while there's a line number
						line = re.match("^(\d+)",statement).group(1)							# get line number
						statement = statement[len(line):].strip()								# remove the line number
						self.tokens.append(LineNumberToken(int(line),parseInfo))				# add the token
						parseInfo["goto"][int(line)] = True 									# record it as being accessed.
						if statement != "" and statement[0] == ",":								# , seperated numbers
							self.tokens.append(CharacterToken(",",parseInfo))
							statement = statement[1:]

			elif statement[0] == '"':															# Quoted string.
				statement = statement[1:]														# remove opening quote
				n = statement.find('"')															# find closing quote
				n = n if n >= 0 else len(statement)												# if not found, whole statement
				self.tokens.append(StringToken(statement[:n],parseInfo))						# add string token
				statement = statement[n+1:]														# past closing quote

			elif statement[0] >= 'A' and statement[0] <= 'Z':									# Variable
				m = re.match("^([A-Z][A-Z0-9]?\\$?\\%?\\(?)",statement)							# extract variable
				assert m is not None 
				self.tokens.append(VariableToken(m.group(1).lower(),parseInfo))					# add tokenn
				parseInfo["variables"][m.group(1).lower()] = True 								# add to variables list.
				statement = statement[len(m.group(1)):]											# remove variable

			else:																				# render as a character
				self.tokens.append(CharacterToken(statement[0],parseInfo))
				statement = statement[1:]
			statement = statement.strip()

	def render(self,renderInfo):
		statementRender = ""
		for t in self.tokens:																	# build line
			statementRender = statementRender + t.renderText(renderInfo)
		statementRender = statementRender.strip()												# remove end spaces

		for i in range(1,7):																	# characteristic processing
			statementRender = statementRender.replace("stats({0})".format(i),"stats."+self.characteristic[i-1])

		while statementRender.find("  ") >= 0:													# remove superfluous spaces
			statementRender = statementRender.replace("  "," ")						
		statementRender = statementRender.replace(" (","(").replace("( ","(")

		statementRender = statementRender.replace("~"," ")										# convert string spaces to actual spaces
		if statementRender[:4].lower() == "next":												# next unindents
			renderInfo["indent"] -= 1
		indent = "    " * (renderInfo["indent"]+renderInfo["tempIndent"])						# calculate indent
		if statementRender[:3].lower() == "for":												# for/then indent after
			renderInfo["indent"] += 1
		if statementRender[-4:].lower() == "then":
			renderInfo["tempIndent"] += 1
		initIndent = " " * renderInfo["firstIndent"]
		renderInfo["handle"].write("{2}{1}{0}\n".format(statementRender,indent,initIndent))		# write it

# ***************************************************************************************************************************************************
#														Program Line Object
# ***************************************************************************************************************************************************

class ProgramLine(BaseRenderer):
	def __init__(self,lineNumber,lineSource,parseInfo):
		self.lineNumber = LineNumberToken(lineNumber,parseInfo) 								# save line number token
		self.intLineNumber = lineNumber
		inQuotes = False 																		# replace colons not in quotes with chr(1)
		for i in range(0,len(lineSource)):
			if lineSource[i] == '"':
				inQuotes = not inQuotes
			if lineSource[i] == ':' and not inQuotes:
				lineSource = lineSource[:i]+chr(1)+lineSource[i+1:]
			if lineSource[i] == chr(0xA7):
				lineSource = lineSource[:i+1]+chr(1)+lineSource[i+1:]

		lineSource = lineSource.split(chr(1))													# convert into multiple statements
		self.lineParts = [Statement(x,parseInfo) for x in lineSource]							# convert to list of objects

	def render(self,renderInfo):
		renderInfo["commentManager"].render(self.intLineNumber,renderInfo)
		if self.intLineNumber in renderInfo["linesToRender"] or renderInfo["renderAllLineNumbers"]:
			renderInfo["handle"].write(self.lineNumber.renderText(renderInfo)+"\n")
		for p in self.lineParts:
			p.render(renderInfo)
		renderInfo["tempIndent"] = 0		

# ***************************************************************************************************************************************************
#														Program Object
# ***************************************************************************************************************************************************

class Program(BaseRenderer):
	def __init__(self,programDumpName,parseInfo):
		source = open(programDumpName,"rb").read(-1)											# read and convert to integers
		source = [s for s in source]	
		self.lines = [] 																		# array of lines.
		parseInfo["variables"] = {} 															# hash of defined variables
		parseInfo["goto"] = {} 																	# hash of accessed lines.
		ptr = 0x2 																				# code starts here.
		done = False
		while not done:
			nextInstr = source[ptr+0]+source[ptr+1] * 256										# get link to next
			if nextInstr != 0:																	# if non-zero decode and add instruction
				lineNumber = source[ptr+2]+source[ptr+3]*256									# get current line number
				ptr = ptr + 4 																	# Point to the tokenised code.
				if source[ptr] != 0x8F and lineNumber >= 90:									# Do not do comments or machine code dump.
					line = ""																	# create the line
					while source[ptr] != 0:
						line = line+chr(source[ptr])
						ptr = ptr + 1				
					self.lines.append(ProgramLine(lineNumber,line,parseInfo))					# Create a line object
			ptr = nextInstr-0x401+2 															# go to next instruction.
			if nextInstr == 0:
				done = True			
		self.accessedLines = parseInfo["goto"] 													# save accessed lines.

	def render(self,renderInfo):
		renderInfo["linesToRender"] = self.accessedLines										# these lines are referred to by GOTO/GOSUB
		for l in self.lines:																	# render every line
			l.render(renderInfo)

# ***************************************************************************************************************************************************
#													Variable mapping object
# ***************************************************************************************************************************************************

class VariableMapper:
	def __init__(self):
		self.map = {}
		src = [x.strip() for x in open("dungeon.variables").readlines() if (x+" ")[0] != '#']	# read source
		src = [x for x in src if x != ""]
		for l in src:																			# read variables from source
			m = re.match("^([a-zA-Z]\\w?\\$?\\%?\\(?)\\s+(\\??[_a-zA-Z][\\w\\_]*\\$?\\%?\\(?)",l)
			assert m is not None,"Variable error "+l
			self.map[m.group(1).lower()] = m.group(2)
			if m.group(1)[-1] == "(" and m.group(2)[-1] != "(":
				assert False,"Bracket imbalance "+l 
	def vmap(self,var):
		return self.map[var.lower()] if var.lower() in self.map else var

# ***************************************************************************************************************************************************
#														Comment object
# ***************************************************************************************************************************************************

class Comment:
	def __init__(self,line,label):
		self.lineNumber = line
		self.label = label 
		self.comments = []
	def add(self,comment):
		self.comments.append(comment.strip())
	def getLabel(self):
		return self.label
	def render(self,renderInfo):
		for c in self.comments:
			self.renderComment(c.strip(),renderInfo)

	def renderComment(self,comment,renderInfo):
		if comment[0] == "$" or comment[0] == "*":												# not a bars comment.
			spaces = ""
			bars = ""
			while comment[0] == '$' or comment[0] == "*":
				if comment[0] == '$':
					spaces = spaces + "\n"
				else:
					bars = bars +(" "*renderInfo["firstIndent"])+("*" * renderInfo["commentWidth"]) + "\n"
				comment = comment[1:].strip()
			renderInfo["handle"].write(bars+spaces)
			self.renderSimpleComment(comment,renderInfo,False)
			renderInfo["handle"].write(spaces+bars)

		else:
			self.renderSimpleComment(comment,renderInfo,True)

	def renderSimpleComment(self,comment,renderInfo,bars):
		for l in comment.split(";"):
			if l.strip() != "":
				if bars:
					l = "---  "+l+"  ---"
				renderInfo["handle"].write("{0}{1}{2}\n".format(" "*renderInfo["firstIndent"]," " * int(renderInfo["commentWidth"]/2-len(l)/2),l))
		pass

# ***************************************************************************************************************************************************
#													Comment Manager object
# ***************************************************************************************************************************************************

class CommentManager:
	def __init__(self):
		src = [x.strip() for x in open("dungeon.comments").readlines() if (x+" ")[0] != '#']		# read source
		src = [x.replace("\t"," ") for x in src if x != ""]										# remove tabs and empty lines
		self.comments = {}
		for l in src:																			# for each line
			m = re.match("^(\d+)(.*)$",l)														# look at the numbers
			currentLine = int(m.group(1))														# get line number
			l = m.group(2).strip()																# rest of line.
			label = ""
			if l[0] == '.':																		# label provided.
				label = l[:(l+":").find(":")][1:]												# extract it
				l = l[len(label)+1:].strip()													# remove from line.
			assert currentLine not in self.comments,"Line missing "+str(currentLine)
			self.comments[currentLine] = Comment(currentLine,label)								# create object.
			if l != "":
				assert l[0] == ':'																# check first colon				
				for c in l[1:].split(":"):														# add comments to comment object
					self.comments[currentLine].add(c)

	def lmap(self,lineNumber):
		name = str(lineNumber)																	# use line number by default
		if lineNumber in self.comments and self.comments[lineNumber].getLabel() != "":			# label present
			name = self.comments[lineNumber].getLabel()+"@"+str(lineNumber)						# create full label
		return name 

	def render(self,lineNumber,renderInfo):
		if lineNumber in self.comments:
			self.comments[lineNumber].render(renderInfo)

pi = {"tokeniser":TokenManager() }
ri = { "handle":open("dungeon.lst","w"),"indent":0,"tempIndent":0,"variableMapper":VariableMapper(),"commentManager":CommentManager(),"firstIndent":8,"commentWidth":116 }
ri["renderAllLineNumbers"] = True
dc = Program("dungeon.prg",pi)
dc.render(ri)
