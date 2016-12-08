// Starter code from: HelloTriangle.js (c),PickObject.js (c), and RotateObject.js 2012 matsuda
//****************************************
//* Name: Leo Gomez                      *
//* Login: legomez                       *
//* SID: 1360609                         *
//* prog#: 4                              *
//* file: TexMap.js                      *
//* class: CMPS - 160                   *
//* description:                         *
//* pans, rotates, zooms, and translates *
//* on z-axis for the camera and objects.* 
//* Last there is now texture for one    *
//* object and all commands              *
//* for objects are still here from lab4 *
//****************************************
// Vertex shader program
var FIRST_VSHADER_SOURCE =
  [
  'precision mediump float;',
  'uniform mat4 mWorld;',
  'uniform mat4 mView;',
  'uniform mat4 mProj;',
  'uniform mat4 mTran;',
  'uniform mat4 mRot;',
  'uniform mat4 mScal;',
  'uniform mat4 mTran0;',
  'uniform mat4 mITran0;',
  'uniform mat4 mCamRot;',
  '',
  'attribute vec3 vNormal;',
  'varying vec3 fNormal;',
  'attribute vec4 a_Position;',
  'attribute vec2 verTexCor;',
  'varying vec2 fragTexCor;',
  'uniform vec3 color;',
  'varying vec3 n_color;',
  'void main() {',
  '  vec3 Ia = vec3(0.2,0.2,0.2);',
  '  vec3 Light = vec3(1.0,1.0,1.0);',
  '  vec3 L = normalize(vec3(1.0,0.0,-1.0));',
  '  fNormal = (mCamRot * mRot * mWorld * vec4(vNormal,0.0)).xyz;',
  '',
  '  fragTexCor = verTexCor;',
  '  n_color = Light * color * max(dot(L,fNormal),0.0);',
  '',
  '  gl_Position =  mProj * mView * mCamRot * mTran * mTran0 * mScal * mRot * mITran0 * mWorld * a_Position;',
  '}'
  ].join('\n');

// Fragment shader program
var FIRST_FSHADER_SOURCE =
  [
  'precision mediump float;',
  'varying vec3 n_color;',
  'varying vec3 fNormal;',
  'varying vec2 fragTexCor;',
  'uniform sampler2D sampler;',
  'void main() {',
  '',
  //'  gl_FragColor = vec4(n_color, 1.0);',
  '  gl_FragColor = texture2D(sampler, fragTexCor);',
  '}'
  ].join('\n');
  
  // Vertex shader program
var SECOND_VSHADER_SOURCE =
  [
  'precision mediump float;',
  'uniform mat4 mWorld;',
  'uniform mat4 mView;',
  'uniform mat4 mProj;',
  'uniform mat4 mTran;',
  'uniform mat4 mRot;',
  'uniform mat4 mScal;',
  'uniform mat4 mTran0;',
  'uniform mat4 mITran0;',
  'uniform mat4 mCamRot;',
  ' ',
  'attribute vec3 vNormal;',
  'varying vec3 fNormal;',
  'attribute vec4 a_Position;',
  'uniform vec4 color;',
  'void main() {',
  '  fNormal = (mCamRot * mRot * mWorld * vec4(normalize(vNormal),0.0)).xyz;',
  '  gl_Position =  mProj * mView * mCamRot * mTran * mTran0 * mScal * mRot * mITran0 * mWorld * a_Position;',
  '}'
  ].join('\n');

// Fragment shader program
var SECOND_FSHADER_SOURCE =
  [
  'precision mediump float;',
  'uniform vec4 color;',
  'varying vec3 fNormal;',
  'void main() {',
  '  vec3 Ia = vec3(0.2,0.2,0.2);',
  '  vec3 Light = vec3(1.0,1.0,1.0);',
  '  vec3 L = normalize(vec3(1.0,0.0,0.0));',
  '',
  '  vec3 LightI = Ia + Light* max(dot(fNormal,L),0.0);',
  '',
  '  gl_FragColor = vec4(color.rgb * LightI, 1.0);',
  '}'
  ].join('\n');
  
// Retrieve <canvas> element
var canvas = document.getElementById('webgl');

// Get the rendering context for WebGL
// used a different type of context
// in order to keep the background
// after including more triangles

var gl = WebGLUtils.setupWebGL(canvas, {preserveDrawingBuffer: true});

var viewMatrix = new Matrix4();
var projMatrix = new Matrix4();
  
var polyAmount;
var coorAmount;

var polyNormals;
var polyNormals2;

var vertNormals;
var vertNormals2;

var UVcoor;
var UVcoor2;
var UVcoorZ;
var UVcoorZ2;

var polyAmount2;
var coorAmount2;

var polyDetails = new Array();
var coorDetails = new Array();

var polyDetails2 = new Array();
var coorDetails2 = new Array();

var coorChecker = false;
var polyChecker = false;

var coorChecker2 = false;
var polyChecker2 = false;

var Ymax = 0;
var Ymin = 0;
var Xmax = 0;
var Xmin = 0;
var Zmax = 0;
var Zmin = 0;
var maxObjVal = 0;

var Ymax2 = 0;
var Ymin2 = 0;
var Xmax2 = 0;
var Xmin2 = 0;
var Zmax2 = 0;
var Zmin2 = 0;
var maxObjVal2 = 0;

color = [1,0,0];
color2 = [0,0,1];

var bcolor = [255,255,255];
var orthoCharge = true;

//for checking object color
var passColor = false;
var passColor2 = false;

//value that renders from mouse
var currentAngle = [0.0,0.0];
var scaleFactor = 1;
var transformV = [0.0,0.0,0.0];

//value that renders from mouse
var currentAngle2 = [0.0,0.0];
var scaleFactor2 = 1;
var transformV2 = [0.0,0.0,0.0];

//camera value factors
var zoomF = 0;
var camX = 0;var camY = 0;var camZ = 0;
var inOutCam = false;
var inOutObject = false;

//camera rotation
var currentCamAngle = [0.0,0.0,0.0];

//checks if object is clicked
var isObject = false;

//checks if object is clicked
var isObject2 = false;

var mouseX;
var mouseY;

var oldTran = new Matrix4();
oldTran.setIdentity();

var oldTran2 = new Matrix4();
oldTran2.setIdentity();

function main() 
{
	//separated the code into backgrounds changes
	//and drawing values
	drawBackground();
	
	//grabs the information from the file
	document.getElementById("infile1").addEventListener("change", readFileCoor, false);
	document.getElementById("infile2").addEventListener("change", readFilePoly, false);
	document.getElementById("infile3").addEventListener("change", readFileCoor2, false);
	document.getElementById("infile4").addEventListener("change", readFilePoly2, false);
	if(polyChecker && coorChecker && polyChecker2 && coorChecker2)
		nextMain();
}

//gets all the new triangle details
//to add to the canvas
function readFileCoor(event)
{
	var file = event.target.files[0];
	var type = '';
	if(file)
	{
		var tmp = file.name.split('.');
		type = tmp.pop();
	}//if(file)
	if(!file)
	{
		alert("Failed to load file");
	}//if(not file)
		
	//checks to see if its a coor file
	else if(!type.match("coor"))
	{
		alert(file.name + " is not a valid coor file")
	} //else if (not coor)
	else
	{
		coorChecker = true;
		var r = new FileReader();
		r.onload = function(e)
		{
			//gets the file
			var allXvalues = new Array();
			var allYvalues = new Array();
			var allZvalues = new Array();
			
			var dummy1 = e.target.result;
			//gets first line from file
			coorAmount = dummy1.substr(0,dummy1.indexOf("\n"));
			var lines = dummy1.split("\n");
			lines.splice(0,1);
			dummy1 = lines.join("\n");
			//gets rid of blank space
			var dummy2 = dummy1.replace(/ /g,",");
			var contents = dummy2.replace(/\n/g,",");
			//splits and reverses the values
			//to pop later
			var temp1 = contents.split(",");
			var temp2 = new Array();
			for(var i = 0;i < temp1.length; i++)
			{
				if(temp1[i])
					temp2.push(temp1[i]);
			}
			var temp3 = new Array();
			for(var i = 0;i<temp2.length;i++)
			{
				if(i%4 != 0)
					temp3.push(temp2[i]);
			}//for loop
			
			//max and mins values
			for(var i = 0;i<temp3.length;i++)
			{
				if(i%3 == 0)
					allXvalues.push(temp3[i]);
			}//for loop
			Xmax = Math.max(...allXvalues);
			Xmin = Math.min(...allXvalues);
			for(var i = 0;i<temp3.length;i++)
			{
				if((i+2)%3 == 0)
					allYvalues.push(temp3[i]);
			}//for loop
			Ymax = Math.max(...allYvalues);
			Ymin = Math.min(...allYvalues);
			for(var i = 0;i<temp3.length;i++)
			{
				if((i+1)%3 == 0)
					allZvalues.push(temp3[i]);
			}//for loop
			Zmax = Math.max(...allZvalues);
			Zmin = Math.min(...allZvalues);
			
			//gives all the coor stuff
			//coorDetails = temp3;
			for(var i = 0;i<temp3.length;i++)
			{
				coorDetails.push(parseFloat(temp3[i]));
			}
			//console.log("coorDetails = ",coorDetails);
			coorDetails.splice(0,0,0,0,0);
			main();
		}//onload
		r.readAsText(file);
	}//else
}//readFileCoor()

//gets all the new triangle details
//to add to the canvas
function readFileCoor2(event)
{
	var file = event.target.files[0];
	var type = '';
	if(file)
	{
		var tmp = file.name.split('.');
		type = tmp.pop();
	}//if(file)
	if(!file)
	{
		alert("Failed to load file");
	}//if(not file)
		
	//checks to see if its a coor file
	else if(!type.match("coor"))
	{
		alert(file.name + " is not a valid coor file")
	} //else if (not coor)
	else
	{
		coorChecker2 = true;
		var r = new FileReader();
		r.onload = function(e)
		{
			//gets the file
			var allXvalues = new Array();
			var allYvalues = new Array();
			var allZvalues = new Array();
			
			var dummy1 = e.target.result;
			//gets first line from file
			coorAmount2 = dummy1.substr(0,dummy1.indexOf("\n"));
			var lines = dummy1.split("\n");
			lines.splice(0,1);
			dummy1 = lines.join("\n");
			//gets rid of blank space
			var dummy2 = dummy1.replace(/ /g,",");
			var contents = dummy2.replace(/\n/g,",");
			//splits and reverses the values
			//to pop later
			var temp1 = contents.split(",");
			var temp2 = new Array();
			for(var i = 0;i < temp1.length; i++)
			{
				if(temp1[i])
					temp2.push(temp1[i]);
			}
			var temp3 = new Array();
			for(var i = 0;i<temp2.length;i++)
			{
				if(i%4 != 0)
					temp3.push(temp2[i]);
			}//for loop
			
			//max and mins values
			for(var i = 0;i<temp3.length;i++)
			{
				if(i%3 == 0)
					allXvalues.push(temp3[i]);
			}//for loop
			Xmax2 = Math.max(...allXvalues);
			Xmin2 = Math.min(...allXvalues);
			for(var i = 0;i<temp3.length;i++)
			{
				if((i+2)%3 == 0)
					allYvalues.push(temp3[i]);
			}//for loop
			Ymax2 = Math.max(...allYvalues);
			Ymin2 = Math.min(...allYvalues);
			for(var i = 0;i<temp3.length;i++)
			{
				if((i+1)%3 == 0)
					allZvalues.push(temp3[i]);
			}//for loop
			Zmax2 = Math.max(...allZvalues);
			Zmin2 = Math.min(...allZvalues);
			
			//gives all the coor stuff
			//coorDetails = temp3;
			for(var i = 0;i<temp3.length;i++)
			{
				coorDetails2.push(parseFloat(temp3[i]));
			}
			//console.log("coorDetails = ",coorDetails);
			coorDetails2.splice(0,0,0,0,0);
			main();
		}//onload
		r.readAsText(file);
	}//else
}//readFileCoor2()

function readFilePoly(event)
{
	var file = event.target.files[0];
	var type = '';
	if(file)
	{
		var tmp = file.name.split('.');
		type = tmp.pop();
	}//if(file)
		
	if(!file)
	{
		alert("Failed to load file");
	}//if(not file)
	else if(!type.match("poly"))
	{
		alert(file.name + " is not a valid .poly file")
	} //else if (not coor)
	else
	{
		polyChecker = true;
		var r = new FileReader();
		r.onload = function(e)
		{
			//gets the file
			var dummy1 = e.target.result;
			//gets first line from file
			polyAmount = dummy1.substr(0,dummy1.indexOf("\n"));
			var lines = dummy1.split("\n");
			lines.splice(0,1);
			for(var i = 0;i<lines.length;i++)
			{
				if(!(lines[i]))
				{
					lines.splice(i,1);
					i--;
				}
			}
			dummy1 = lines.join("\n");
			//split the lines
			var stuff = dummy1.split("\n");
			//split the values make a 2d Array
			for(var j = 0; j < stuff.length; j++)
			{
				stuff[j] = stuff[j].split(" ");
			}
			//clear empty spaces
			for(var j = 0; j < stuff.length; j++)
			{
				for(var i = 0; i<stuff[j].length; i++)
				{
					if(!(stuff[j][i]))
					{
						stuff[j].splice(i,1);
						i--;
					}
				}
			}
			var atemp = new Array();
			
			//splits into possibly more triangles
			//console.log("stuff = ",stuff);
			for(var j = 0; j < stuff.length;j++)
			{	
				if(stuff[j].length > 4)
				{
					for(var i = 3;i <stuff[j].length;i++)
					{
						atemp.push(stuff[j][1]);
						atemp.push(stuff[j][i-1]);
						atemp.push(stuff[j][i]);
						if(i > 3)
						{
							polyAmount++;
						}
					}
				}else
				{
					for(var a = 1;a<stuff[j].length;a++)
					{
						atemp.push(stuff[j][a]);
					}
				}
			}
			for(var i = 0;i<atemp.length;i++)
			{
				polyDetails.push(parseFloat(atemp[i]));
			}
			//polyDetails.splice(0,0,0,0,0);
			//console.log("polyDetails = ",polyDetails);
			
			
			
			//get the normals of the polygons for flat shading
			polyNormals = new Array();
			var V1 = new Array();
			V1 = [];
			var V2 = new Array();
			V2 = [];
			var V3 = new Array();
			V3 = [];
			var a = new Array();
			a = [];
			var b = new Array();
			b = [];
			var result = new Array();
			result = [];
			polyNormals = [];

			var polygons = polyDetails;
			var vertices = coorDetails;
			
			//console.log("coorDetails.length = ",coorDetails.length);
			//console.log("polygons = ",polygons);
			//console.log("polygons.length = ",polygons.length);
			//loops through the polygons and obtains the poly normals
			//polygon[0,1,2,...,n] = N1+...+Nn = n1,n2,n2,...nN
			//corrDetails = {0,0,0, 1,2,3,  ...2,9,3} = v1,v2, ..., vN
			var tempNorm = new Array();
			for(var i = 0; i < polygons.length;i+=3)
			{
				//console.log("polygons = ",polygons);
				//console.log("i = ",i);
				tempNorm = getFaceNormal([polygons[i],polygons[i+1],polygons[i+2]],vertices);
				
				polyNormals[i] = tempNorm[0];
				polyNormals[i+1] = tempNorm[1];
				polyNormals[i+2] = tempNorm[2];
			}
			
			var N1 = 0;
			var N2 = 0;
			var N3 = 0;
			var mag = 0;
			
			vertNormals = new Array();
			var tempPoint = new Array();
			var vertexNorm = [0,0,0];
			var vertexInCommon = new Array();
			
			//vertex normals
			for(var j = 1; j < vertices.length/3;j++)
			{
				//console.log("made it here");
				for(var i = 0; i < polygons.length;i+=3)
				{
					tempPoint = [polygons[i],polygons[i+1],polygons[i+2]];
					
					if(tempPoint[0] == j||tempPoint[1] == j||tempPoint[2] == j)
					{
						vertexInCommon.push(tempPoint[0]);
						vertexInCommon.push(tempPoint[1]);
						vertexInCommon.push(tempPoint[2]);
					}
				}
				
				for(var i = 0; i < vertexInCommon.length;i++)
				{
					if(i%3 == 0)
					{
						vertexNorm[0] += vertexInCommon[i];
					}else if(i%3 == 1)
					{
						vertexNorm[1] += vertexInCommon[i];
					}else if(i%3 == 2)
					{
						vertexNorm[2] += vertexInCommon[i];
					}
				}
				
				//console.log("this ran many times");
				N1 = vertexNorm[0];
				N2 = vertexNorm[1];
				N3 = vertexNorm[2];
				
				mag = Math.sqrt(N1*N1+N2*N2+N3*N3);
				if(mag == 0)
				{
					mag = 1;
				}
				vertexNorm[0] = N1/mag;
				vertexNorm[1] = N2/mag;
				vertexNorm[2] = N3/mag;
				
				vertNormals.push(vertexNorm[0]);
				vertNormals.push(vertexNorm[1]);
				vertNormals.push(vertexNorm[2]);
			}
			
			//console.log("vertNormals = ",vertNormals);
			//console.log("vertNormals.length = ",vertNormals.length);
			
			
			//my version of getting the face normals
			/*
			for(var i = 0; i < polygons.length;i+=3)
			{
				//N = triangle->pointA pointB pointC
				//U = pointB - pointA
				//V = pointC - pointA
				//Normal = UxV
				//for every index in indexes: index = index - 1
				V1 = [coorDetails[(polygons[i]*3)],coorDetails[(polygons[i]*3)+1],coorDetails[(polygons[i]*3)+2]];
				V2 = [coorDetails[(polygons[i+1]*3)],coorDetails[(polygons[i+1]*3)+1],coorDetails[(polygons[i+1]*3)+2]];
				V3 = [coorDetails[(polygons[i+2]*3)],coorDetails[(polygons[i+2]*3)+1],coorDetails[(polygons[i+2]*3)+2]];
				
				a = [V2[0] - V1[0],V2[1] - V1[1],V2[2] - V1[2]];
				b = [V3[0] - V1[0],V3[1] - V1[1],V3[2] - V1[2]];
				
				result = [a[1] * b[2] - a[2] * b[1],
						  a[2] * b[0] - a[0] * b[2],
						  a[0] * b[1] - a[1] * b[0]
				]	
				polyNormals.push(result[0]);
				polyNormals.push(result[1]);
				polyNormals.push(result[2]);
			}
			//console.log("normals = ",polyNormals);
			*/
			
			//normalizes the poly normals
			N1 = 0;
			N2 = 0;
			N3 = 0;
			mag = 0;

			/*
			for(var i = 0; i < polyNormals.length; i+=3)
			{
				//console.log("this ran many times");
				N1 = polyNormals[i];
				N2 = polyNormals[i+1];
				N3 = polyNormals[i+2];
				
				mag = Math.sqrt(N1*N1+N2*N2+N3*N3);
				
				//if(mag == 0)
				//{
				//	polyNormals[i] = N1;
				//	polyNormals[i+1] = N2;
				//	polyNormals[i+2] = N3;
				//}
				//else
				//{
					polyNormals[i] = N1/mag;
					polyNormals[i+1] = N2/mag;
					polyNormals[i+2] = N3/mag;
				//}	
			}
			*/
			
			//console.log("polyAmount = ", polyAmount);
			//console.log("polygons.length = ", polygons.length/3);
			//console.log("polygons.length = ", polygons.length/3);
			//console.log("polygons = ", polygons);
			//console.log("normals = ",polyNormals);
			//console.log("coorAmount = ",coorAmount);
			//console.log("coorDetails = ",coorDetails);
			//console.log("vertices.length/3 = ", vertices.length/3);
			//console.log("polygons.length %3 = ", polygons.length%3);
			
			//
			//make the normals for smooth shading!
			//
			
			//
			//UV corrdinate for the texture
			//
			//console.log("vertNormals = ",vertNormals);
			UVcoor = [];
			UVcoorZ = [];
			for(var i = 0;i<vertNormals.length;i++)
			{
				if(i%3 ==0)
				{
					UVcoor.push(vertNormals[i]);
				}else
				if(i%3 ==1)
				{
					UVcoor.push(vertNormals[i]);
				}else
				if(i%3 ==2)
				{
					UVcoorZ.push(vertNormals[i]);
				}
			}
			//console.log("UVcoor = ",UVcoor);
			//console.log("UVcoorZ = ",UVcoorZ);
			main();
		}//onload
		r.readAsText(file);	
	}//else(read file)
}//readFilePoly()

function readFilePoly2(event)
{
	var file = event.target.files[0];
	var type = '';
	if(file)
	{
		var tmp = file.name.split('.');
		type = tmp.pop();
	}//if(file)
		
	if(!file)
	{
		alert("Failed to load file");
	}//if(not file)
	else if(!type.match("poly"))
	{
		alert(file.name + " is not a valid .poly file")
	} //else if (not coor)
	else
	{
		polyChecker2 = true;
		var r = new FileReader();
		r.onload = function(e)
		{
			//gets the file
			var dummy1 = e.target.result;
			//gets first line from file
			polyAmount2 = dummy1.substr(0,dummy1.indexOf("\n"));
			var lines = dummy1.split("\n");
			lines.splice(0,1);
			for(var i = 0;i<lines.length;i++)
			{
				if(!(lines[i]))
				{
					lines.splice(i,1);
					i--;
				}
			}
			dummy1 = lines.join("\n");
			//split the lines
			var stuff = dummy1.split("\n");
			//split the values make a 2d Array
			for(var j = 0; j < stuff.length; j++)
			{
				stuff[j] = stuff[j].split(" ");
			}
			//clear empty spaces
			for(var j = 0; j < stuff.length; j++)
			{
				for(var i = 0; i<stuff[j].length; i++)
				{
					if(!(stuff[j][i]))
					{
						stuff[j].splice(i,1);
						i--;
					}
				}
			}
			var atemp = new Array();
			
			//splits into possibly more triangles
			//console.log("stuff = ",stuff);
			for(var j = 0; j < stuff.length;j++)
			{	
				if(stuff[j].length > 4)
				{
					for(var i = 3;i <stuff[j].length;i++)
					{
						atemp.push(stuff[j][1]);
						atemp.push(stuff[j][i-1]);
						atemp.push(stuff[j][i]);
						if(i > 3)
						{
							polyAmount2++;
						}
					}
				}else
				{
					for(var a = 1;a<stuff[j].length;a++)
					{
						atemp.push(stuff[j][a]);
					}
				}
			}
			for(var i = 0;i<atemp.length;i++)
			{
				polyDetails2.push(parseFloat(atemp[i]));
			}
			//polyDetails.splice(0,0,0,0,0);
			//console.log("polyDetails = ",polyDetails);
			main();
		}//onload
		r.readAsText(file);	
	}//else(read file)
}//readFilePoly2()

function drawBackground()
{
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }//if(no gl)

  // Specify the color for clearing <canvas>
  // changed to turn dark gray
  gl.clearColor(bcolor[0],bcolor[1],bcolor[2],1.0);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
}//drawBackground()

function setView(evt)
{
	//console.log("setview works");
	//sets up the ortho or perspective view
	//and changes the button color
	if(orthoCharge)
	{
		orthoCharge = false;
		var x = document.getElementById("button");
		x.style.background='#00DD00';
	}
	else
	{
		orthoCharge = true;
		var x = document.getElementById("button");
		x.style.background='#DD0000';
	}
}


function nextMain()
{
	//creates the event handlers and passes
	//the angle and scalefactor
	initEventHandlers(currentAngle,scaleFactor,transformV);
	//animates the changes in color,scale,
	//and rotation
	var loop = function()
	{
		drawBackground();
		runView();
		renderObject();
		renderObject2();
		requestAnimationFrame(loop,canvas);
	};
	loop();
}

//draws the object
function renderObject()
{
	if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
	}//if(no gl)

	// Write the positions of vertices to a vertex shader
	// Takes into consideration position vertices and color
	
	var vertShader = gl.createShader(gl.VERTEX_SHADER);
	var fragShader = gl.createShader(gl.FRAGMENT_SHADER);  
	
	gl.shaderSource(vertShader, FIRST_VSHADER_SOURCE);
	gl.shaderSource(fragShader, FIRST_FSHADER_SOURCE);
	
	//check for shader errors
	gl.compileShader(vertShader);
	if(!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)){
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertShader));
		return;
	}
	gl.compileShader(fragShader);
	if(!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)){
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragShader));
		return;
	}
	
	//create program and link shaders
	var program = gl.createProgram();
	gl.attachShader(program, vertShader);
	gl.attachShader(program, fragShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	
	//catch addtional program errors
	gl.validateProgram(program);
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}
	
	gl.useProgram(program);
	
	//creating all needed maticies for the picture
	var matrixWorldUL = gl.getUniformLocation(program, 'mWorld');
	var matrixViewUL = gl.getUniformLocation(program, 'mView');
	var matrixProjUL = gl.getUniformLocation(program, 'mProj');
	var matrixRotUL = gl.getUniformLocation(program, 'mRot');
	var matrixTranUL = gl.getUniformLocation(program, 'mTran');
	var matrixScalUL = gl.getUniformLocation(program, 'mScal');
	var matrixTran0UL = gl.getUniformLocation(program, 'mTran0');
	var matrixITran0UL = gl.getUniformLocation(program, 'mITran0');
	var matrixCamRot = gl.getUniformLocation(program, 'mCamRot');
	
	//console.log("Ymax = ",Ymax);
	//console.log("Xmax = ",Xmax);
	//console.log("Zmax = ",Zmax);
	//console.log("Ymin = ",Ymin);
	//console.log("Xmin = ",Xmin);
	//console.log("Zmin = ",Zmin);
	var worldMatrix = new Matrix4();
	var tranMatrix = new Matrix4();
	var scalMatrix = new Matrix4();
	var rotMatrix = new Matrix4();
	var tran0Matrix = new Matrix4();
	var itran0Matrix = new Matrix4();
	var camrotMatrix = new Matrix4();
	
	//setting up the values for the matrices
	worldMatrix.setIdentity();
	tranMatrix.setIdentity();
	scalMatrix.setIdentity();
	rotMatrix.setIdentity();
	tran0Matrix.setIdentity();
	itran0Matrix.setIdentity();
	camrotMatrix.setIdentity();
	
	maxObjVal = Math.max(Math.abs(Zmax - Zmin),Math.abs(Ymax-Ymin),Math.abs(Xmax-Xmin));
	tranMatrix.translate((-0.5*(Xmax+Xmin)/2),(0*(Ymax+Ymin)/2),(-1*(Zmax+Zmin)/2));
	scalMatrix.scale(1/maxObjVal,1/maxObjVal,1/maxObjVal);
	
	//sets up rotation
	rotMatrix.setRotate(0,0,1,0);
		
	//pass the matrices through webgl
	gl.uniformMatrix4fv(matrixWorldUL,gl.FALSE, worldMatrix.elements);
	gl.uniformMatrix4fv(matrixViewUL,gl.FALSE, viewMatrix.elements);
	gl.uniformMatrix4fv(matrixProjUL,gl.FALSE, projMatrix.elements);
	gl.uniformMatrix4fv(matrixTranUL,gl.FALSE, tranMatrix.elements);
	gl.uniformMatrix4fv(matrixRotUL,gl.FALSE, rotMatrix.elements);
	gl.uniformMatrix4fv(matrixScalUL,gl.FALSE, scalMatrix.elements);
	
	// Draw the rendered object
	//this is where i put all of the coor details
	var vertices = coorDetails;
	//console.log("vertices = "+vertices);
  
	//this is where i put a line of the poly details
	var polygons = polyDetails;
	//console.log("polygons = "+polygons);
	if(passColor)
	{
		var r = document.getElementById("R").value;
		var g = document.getElementById("G").value;
		var b = document.getElementById("B").value;
		color = [r/50,g/50,b/50];
	}
	//passColor = true;
	//passes the value "color" to webgl
	program.color = gl.getUniformLocation(program, 'color');
	gl.uniform3fv(program.color, [color[0],color[1],color[2]]);
	
	//do light shading here-----------------------------------------------------------------------------------***
	
	// Create a buffer objects for coor,poly, and normals
	//buffer for coor
	var coorVertexBufferObject = gl.createBuffer();
	
	//buffer for poly
	var polyIndexBufferObject = gl.createBuffer();
	
	//buffer for normal
	var normalsBufferObject = gl.createBuffer();
	
	//buffer for textures
	var texCoordAttribObject = gl.createBuffer();
	
	//make texture
	var objectTexture = gl.createTexture();
	
	//uniform locations
	var a_Position = gl.getAttribLocation(program, 'a_Position');
	
	var normalsAttribLocation = gl.getAttribLocation(program,'vNormal');
	
	var texCoordAttribLocation = gl.getAttribLocation(program,'verTexCor');

	
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return -1;
	}//if()
			
	// Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, coorVertexBufferObject);
	// Write date into the buffer objectz
	//console.log("vertices = ",vertices);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),gl.STATIC_DRAW);
	
	// Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0,0);
	//gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, gl.FALSE, 3*Float32Array.BYTES_PER_ELEMENT, 0);
	
	
	// Bind the buffer object to target
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polyIndexBufferObject);
	// Write date into the buffer objectz
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(polygons), gl.STATIC_DRAW);

	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);
	//console.log("polyVal = ",polygons);
	
	//Assign the buffer object to bind the normals
	gl.bindBuffer(gl.ARRAY_BUFFER, normalsBufferObject);

	//write the data into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(polyNormals),gl.STATIC_DRAW);
	
	
	gl.bindBuffer(gl.ARRAY_BUFFER, normalsBufferObject);

	gl.vertexAttribPointer(normalsAttribLocation, 3, gl.FLOAT, gl.TRUE,0,0);
	
	gl.enableVertexAttribArray(normalsAttribLocation);
	
	//console.log("UVcoor = ",UVcoor);
	
	//values for texture
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordAttribObject)
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(UVcoor),gl.STATIC_DRAW);
	gl.vertexAttribPointer(texCoordAttribLocation,1,gl.FLOAT,gl.FALSE,0,0);
	gl.enableVertexAttribArray(texCoordAttribLocation);

	//sets up texture
	gl.bindTexture(gl.TEXTURE_2D, objectTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,gl.LINEAR);
	//gl.texImage2D(gl.TEXTURE_2D, 0,gl.RGBA,gl.RGBA,
	//               gl.UNSIGNED_BYTE,document.getElementById('rust-image'));
	gl.bindTexture(gl.TEXTURE_2D,null);
	
	//console.log("Done drawing objects");
	//console.log("coorAmount",coorAmount);
	//draws and rotates object
	
	//tranMatrix.invert();
	oldTran.invert();
	itran0Matrix.translate(oldTran.elements[0],oldTran.elements[1],oldTran.elements[2]);
	oldTran.invert();
	tran0Matrix.translate(oldTran.elements[0],oldTran.elements[1],oldTran.elements[2]);
	scalMatrix.scale(scaleFactor,scaleFactor,scaleFactor);
	rotMatrix.rotate(currentAngle[0],1,0,0);
	rotMatrix.rotate(currentAngle[1],0,1,0);

	tranMatrix.translate(transformV[0],-transformV[1],transformV[2]);
	
	oldTran.translate(transformV[0],-transformV[1],transformV[2]);
	
	camrotMatrix.rotate(currentCamAngle[0],1,0,0);
	camrotMatrix.rotate(currentCamAngle[1],0,1,0);
	camrotMatrix.rotate(currentCamAngle[2],0,0,1);
	
	//i need to make it so it translates with the view
	gl.uniformMatrix4fv(matrixWorldUL, gl.FALSE,worldMatrix.elements);
	gl.uniformMatrix4fv(matrixTranUL, gl.FALSE,tranMatrix.elements);
	gl.uniformMatrix4fv(matrixScalUL, gl.FALSE,scalMatrix.elements);
	gl.uniformMatrix4fv(matrixRotUL, gl.FALSE,rotMatrix.elements);
	gl.uniformMatrix4fv(matrixITran0UL, gl.FALSE,itran0Matrix.elements);
	gl.uniformMatrix4fv(matrixTran0UL, gl.FALSE,tran0Matrix.elements);
	gl.uniformMatrix4fv(matrixCamRot, gl.FALSE,camrotMatrix.elements);
	
	gl.bindTexture(gl.TEXTURE_2D, objectTexture);
	gl.activeTexture(gl.TEXTURE0);
	
	//draws the object
	gl.drawElements(gl.TRIANGLES, 3*polyAmount, gl.UNSIGNED_SHORT, 0);
	
}//renderObject()

//draws the object
function renderObject2()
{
	if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
	}//if(no gl)

	// Write the positions of vertices to a vertex shader
	// Takes into consideration position vertices and color
	
	var vertShader2 = gl.createShader(gl.VERTEX_SHADER);
	var fragShader2 = gl.createShader(gl.FRAGMENT_SHADER);  
	
	gl.shaderSource(vertShader2, SECOND_VSHADER_SOURCE);
	gl.shaderSource(fragShader2, SECOND_FSHADER_SOURCE);
	
	//check for shader errors
	gl.compileShader(vertShader2);
	if(!gl.getShaderParameter(vertShader2, gl.COMPILE_STATUS)){
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertShader2));
		return;
	}
	gl.compileShader(fragShader2);
	if(!gl.getShaderParameter(fragShader2, gl.COMPILE_STATUS)){
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragShader2));
		return;
	}
	
	//create program and link shaders
	var program2 = gl.createProgram();
	gl.attachShader(program2, vertShader2);
	gl.attachShader(program2, fragShader2);
	gl.linkProgram(program2);
	if(!gl.getProgramParameter(program2, gl.LINK_STATUS)){
		console.error('ERROR linking program2!', gl.getProgramInfoLog(program2));
		return;
	}
	
	//catch addtional program errors
	gl.validateProgram(program2);
	if(!gl.getProgramParameter(program2, gl.VALIDATE_STATUS)){
		console.error('ERROR validating program2!', gl.getProgramInfoLog(program2));
		return;
	}
	
	gl.useProgram(program2);
	
	//creating all needed maticies for the picture
	//creating all needed maticies for the picture
	var matrixWorldUL = gl.getUniformLocation(program2, 'mWorld');
	var matrixViewUL = gl.getUniformLocation(program2, 'mView');
	var matrixProjUL = gl.getUniformLocation(program2, 'mProj');
	var matrixRotUL = gl.getUniformLocation(program2, 'mRot');
	var matrixTranUL = gl.getUniformLocation(program2, 'mTran');
	var matrixScalUL = gl.getUniformLocation(program2, 'mScal');
	var matrixTran0UL = gl.getUniformLocation(program2, 'mTran0');
	var matrixITran0UL = gl.getUniformLocation(program2, 'mITran0');
	var matrixCamRot = gl.getUniformLocation(program2, 'mCamRot');
	
	//console.log("Ymax2 = ",Ymax2);
	//console.log("Xmax2 = ",Xmax2);
	//console.log("Zmax2 = ",Zmax2);
	//console.log("Ymin2 = ",Ymin2);
	//console.log("Xmin2 = ",Xmin2);
	//console.log("Zmin2 = ",Zmin2);
	var worldMatrix = new Matrix4();
	var tranMatrix = new Matrix4();
	var scalMatrix = new Matrix4();
	var rotMatrix = new Matrix4();
	var tran0Matrix = new Matrix4();
	var itran0Matrix = new Matrix4();
	var camrotMatrix = new Matrix4();
	
	//setting up the values for the matrices
	worldMatrix.setIdentity();
	tranMatrix.setIdentity();
	scalMatrix.setIdentity();
	rotMatrix.setIdentity();
	tran0Matrix.setIdentity();
	itran0Matrix.setIdentity();
	camrotMatrix.setIdentity();
	
	maxObjVal2 = Math.max(Math.abs(Zmax2 - Zmin2),Math.abs(Ymax2-Ymin2),Math.abs(Xmax2-Xmin2));
	tranMatrix.translate((-0.5*(Xmax+Xmin)/2),(0*(Ymax+Ymin)/2),(-1*(Zmax+Zmin)/2));
	scalMatrix.scale(1/maxObjVal2,1/maxObjVal2,1/maxObjVal2);
	
	//sets up rotation
	rotMatrix.setRotate(0,0,1,0);
	
	//pass the matrices through webgl
	gl.uniformMatrix4fv(matrixWorldUL,gl.FALSE, worldMatrix.elements);
	gl.uniformMatrix4fv(matrixViewUL,gl.FALSE, viewMatrix.elements);
	gl.uniformMatrix4fv(matrixProjUL,gl.FALSE, projMatrix.elements);
	gl.uniformMatrix4fv(matrixTranUL,gl.FALSE, tranMatrix.elements);
	gl.uniformMatrix4fv(matrixRotUL,gl.FALSE, rotMatrix.elements);
	gl.uniformMatrix4fv(matrixScalUL,gl.FALSE, scalMatrix.elements);
	
	// Draw the rendered object
	//this is where i put all of the coor details
	var vertices = coorDetails2;
	//console.log("vertices = "+vertices);
  
	//this is where i put a line of the poly details
	var polygons = polyDetails2;
	//console.log("polygons = "+polygons);
	
	if(passColor2)
	{
		var r = document.getElementById("R2").value;
		var g = document.getElementById("G2").value;
		var b = document.getElementById("B2").value;
		color2 = [r/50,g/50,b/50];
	}
	//passColor2 = true;
	
	//passes the value "color" to webgl
	program2.color = gl.getUniformLocation(program2, 'color');
	gl.uniform4fv(program2.color, [color2[0],color2[1],color2[2],1]);
	//do light shading here-----------------------------------------------------------------------------------***
	//get the normals of the polygons for flat shading
	var polyNormals = new Array();
	var V1 = new Array();
	V1 = [];
	var V2 = new Array();
	V2 = [];
	var V3 = new Array();
	V3 = [];
	var a = new Array();
	a = [];
	var b = new Array();
	b = [];
	var result = new Array();
	result = [];
	polyNormals = [];
	
	//console.log("coorDetails = ",coorDetails);
	//loops through the polygons and obtains the poly normals
	//polygon[0,1,2,...,n] = N1+...+Nn = n1,n2,n2,...nN
	//corrDetails = {0,0,0, 1,2,3,  ...2,9,3} = v1,v2, ..., vN
	for(var i = 0; i < polygons.length;i+=3)
	{
		//N = triangle->pointA pointB pointC
		//U = pointB - pointA
		//V = pointC - pointA
		//Normal = UxV
		//for every index in indexes: index = index - 1
		V1 = [coorDetails2[(polygons[i]*3)],coorDetails2[(polygons[i]*3)+1],coorDetails2[(polygons[i]*3)+2]];
		V2 = [coorDetails2[(polygons[i+1]*3)],coorDetails2[(polygons[i+1]*3)+1],coorDetails2[(polygons[i+1]*3)+2]];
		V3 = [coorDetails2[(polygons[i+2]*3)],coorDetails2[(polygons[i+2]*3)+1],coorDetails2[(polygons[i+2]*3)+2]];
		
		a = [V2[0] - V1[0],V2[1] - V1[1],V2[2] - V1[2]];
		b = [V3[0] - V1[0],V3[1] - V1[1],V3[2] - V1[2]];
		
		result = [a[1] * b[2] - a[2] * b[1],
		          a[2] * b[0] - a[0] * b[2],
				  a[0] * b[1] - a[1] * b[0]
		]	
		polyNormals.push(result[0]);
		polyNormals.push(result[1]);
		polyNormals.push(result[2]);
	}
	//console.log("normals = ",polyNormals);
	
	
	//normalizes the poly normals
	var N1 = 0;
	var N2 = 0;
	var N3 = 0;
	var mag = 0;
	/*
	for(var i = 0; i < polyNormals.length; i+=3)
	{
		//console.log("this ran many times");
		N1 = polyNormals[i];
		N2 = polyNormals[i+1];
		N3 = polyNormals[i+2];
		
		mag = Math.sqrt(N1*N1+N2*N2+N3*N3);
		
		//if(mag == 0)
		//{
		//	polyNormals[i] = N1;
		//	polyNormals[i+1] = N2;
		//	polyNormals[i+2] = N3;
		//}
		//else
		//{
			polyNormals[i] = N1/mag;
			polyNormals[i+1] = N2/mag;
			polyNormals[i+2] = N3/mag;
		//}	
	}
	*/
	
	//console.log("polyAmount = ", polyAmount);
	//console.log("polygons.length = ", polygons.length/3);
	//console.log("polygons.length = ", polygons.length/3);
	//console.log("polygons = ", polygons);
	//console.log("normals = ",polyNormals);
	//console.log("coorAmount = ",coorAmount);
	//console.log("coorDetails = ",coorDetails);
	//console.log("vertices.length/3 = ", vertices.length/3);
	//console.log("polygons.length %3 = ", polygons.length%3);
	
	//
	//make the normals for smooth shading!
	//
	
	
	
	// Create a buffer objects for coor,poly, and normals
	//buffer for coor
	var coorVertexBufferObject = gl.createBuffer();
	
	//buffer for poly
	var polyIndexBufferObject = gl.createBuffer();
	
	//buffer for normal
	var normalsBufferObject = gl.createBuffer();
	
	var a_Position = gl.getAttribLocation(program2, 'a_Position');
	
	var normalsAttribLocation = gl.getAttribLocation(program2,'vNormal');
	
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return -1;
	}//if()
			
	gl.useProgram(program2);
	// Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, coorVertexBufferObject);
	// Write date into the buffer objectz
	//console.log("vertices = ",vertices);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),gl.STATIC_DRAW);
	
	// Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0,0);
	//gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, gl.FALSE, 3*Float32Array.BYTES_PER_ELEMENT, 0);
	
	
	// Bind the buffer object to target
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polyIndexBufferObject);
	// Write date into the buffer objectz
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(polygons), gl.STATIC_DRAW);

	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);
	//console.log("polyVal = ",polygons);
	
	//Assign the buffer object to bind the normals
	gl.bindBuffer(gl.ARRAY_BUFFER, normalsBufferObject);
	//write the data into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(polyNormals),gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, normalsBufferObject);

	gl.vertexAttribPointer(normalsAttribLocation, 3, gl.FLOAT, false,0,0);
	
	gl.enableVertexAttribArray(normalsAttribLocation);
	
	//console.log("Done drawing objects");
	//console.log("coorAmount",coorAmount);
	//tranMatrix.invert();
	oldTran2.invert();
	itran0Matrix.translate(oldTran2.elements[0],oldTran2.elements[1],oldTran2.elements[2]);
	oldTran2.invert();
	tran0Matrix.translate(oldTran2.elements[0],oldTran2.elements[1],oldTran2.elements[2]);
	
	scalMatrix.scale(scaleFactor2,scaleFactor2,scaleFactor2);
	rotMatrix.rotate(currentAngle2[0],1,0,0);
	rotMatrix.rotate(currentAngle2[1],0,1,0);

	tranMatrix.translate(transformV2[0],-transformV2[1],transformV2[2]);
	
	oldTran.translate(transformV2[0],-transformV2[1],transformV2[2]);
	
	camrotMatrix.rotate(currentCamAngle[0],1,0,0);
	camrotMatrix.rotate(currentCamAngle[1],0,1,0);
	camrotMatrix.rotate(currentCamAngle[2],0,0,1);
	
	//i need to make it so it translates with the view
	gl.uniformMatrix4fv(matrixWorldUL, gl.FALSE,worldMatrix.elements);
	gl.uniformMatrix4fv(matrixTranUL, gl.FALSE,tranMatrix.elements);
	gl.uniformMatrix4fv(matrixScalUL, gl.FALSE,scalMatrix.elements);
	gl.uniformMatrix4fv(matrixRotUL, gl.FALSE,rotMatrix.elements);
	gl.uniformMatrix4fv(matrixITran0UL, gl.FALSE,itran0Matrix.elements);
	gl.uniformMatrix4fv(matrixTran0UL, gl.FALSE,tran0Matrix.elements);
	gl.uniformMatrix4fv(matrixCamRot, gl.FALSE,camrotMatrix.elements);
	
	//draws the object
	gl.drawElements(gl.TRIANGLES, 3*polyAmount2, gl.UNSIGNED_SHORT, 0);
	
}//renderObject2()

function runView()
{
	viewMatrix.setIdentity();
	projMatrix.setIdentity();
	//Math.max(Math.abs(Zmax2 - Zmin2),Math.abs(Ymax2-Ymin2),Math.abs(Xmax2-Xmin2));
	//must find bigger value from both objects
	var MaxZ = Math.max(Math.abs(Zmax),Math.abs(Zmin),Math.abs(Zmax2),Math.abs(Zmin2));
	var MaxX = Math.max(Math.abs(Xmax),Math.abs(Xmin),Math.abs(Xmax2),Math.abs(Xmin2));;
	var MaxY = Math.max(Math.abs(Ymax),Math.abs(Ymin),Math.abs(Ymax2),Math.abs(Ymin2));;
	var MaxValue = Math.max(MaxZ,MaxY,MaxX)/5;
	
	//switch statement for ortho or perspective
	if(orthoCharge)
	{	
		viewMatrix.lookAt(0+camX,0+camY,3*MaxValue + camZ,camX,camY,camZ,0,1,0);
		projMatrix.setPerspective(30+zoomF,(canvas.width)/(canvas.height),1,100+Math.abs(camZ));
	}
	else
	{
		viewMatrix.ortho(-MaxValue,MaxValue,-MaxValue,MaxValue,-MaxValue,MaxValue);
	}
}

//sets up the event handlers
function initEventHandlers() {
	var dragging = false;         // Dragging or not
	var leftC = false;
	var rightC = false;
	var middleC = false;
	var lastX = -1, lastY = -1;   // Last position of the mouse
	
	
	//gets rid of the right click menu on the canvas
	canvas.addEventListener("contextmenu", function(event)
	{
		event.preventDefault();
		return false;
	});

	canvas.onmousewheel = function(ev)
	{
		var x = ev.clientX, y = ev.clientY;
		var wheel = ev.wheelDelta;
		//console.log("wheel = ",wheel);
		
		//zooms in on the objects
		if(inOutCam)
		{
			camZ += wheel*0.01;
		}else if(!leftC&&!rightC&&!middleC)
		{
			zoomF += wheel*0.01;
			if(zoomF < -29)
				zoomF = -29;
		}else
		
		//choosing between objects to
		//translate on z-axis
		if(inOutObject)
		{
			if(isObject)
			{
				transformV[2] -= wheel*0.01;
			}
			else if (isObject2)
			{
				transformV2[2] -= wheel*0.01;
			}
		}
			
	}
	
	canvas.onmousedown = function(ev) {   // Mouse is pressed
	var x = ev.clientX, y = ev.clientY;
	// Start dragging if a moue is in <canvas>
	var rect = ev.target.getBoundingClientRect();
	//dragging is true when its within the canvas
	if ((rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom)) 
	{
		lastX = x; lastY = y;
		dragging = true;
	}
	
	//cases for the left mouse click
	if(ev.button === 0)
	{
		leftC = true;
	}else
	//cases for the right mouse click
	if(ev.button === 2)
	{
		rightC = true;
	}else 
	//cases for the middle mouse click
	if(ev.button === 1)
	{
		middleC = true;
		if(check(x,y))
		{
			inOutObject = !inOutObject;
			inOutCam = false;
		}
		else
		{
			inOutCam = !inOutCam;
			inOutObject = false;
		}
	}
	checkObject(x,y);
	//color = [1,0,0];
	//color2 = [0,0,1];
	//passColor = false;
	//passColor2 = false;
	//renderObject();
	//renderObject2();
	//console.log("isObject = ",isObject);
	//console.log("isObject2 = ",isObject2);
	//passColor = true;
	//passColor2 = true;
  };

  //rest values when mouse is up
  canvas.onmouseup = function(ev) { dragging = false;leftC = false;
					rightC = false;middleC = false;isObject = false;isObject2=false;}; // Mouse is released

  //when mouse drags, change the values based on the mouse					
  canvas.onmousemove = function(ev) { // Mouse is moved
    var x = ev.clientX, y = ev.clientY;
	mouseX = x; mouseY = y;
	var factor = 100/canvas.height; // The rotation ratio
	var dx = factor * (x - lastX);
	var dy = factor * (y - lastY);
    if (dragging) {
		if(rightC)
		{
			// Limit x-axis rotation angle to -90 to 90 degrees
			if(isObject)
			{
				currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
				currentAngle[1] = currentAngle[1] + dx;
			}else if(isObject2)
			{
				currentAngle2[0] = Math.max(Math.min(currentAngle2[0] + dy, 90.0), -90.0);
				currentAngle2[1] = currentAngle2[1] + dx;
			}else
			if((!isObject)&&(!isObject2))
			{
				currentCamAngle[1] = currentCamAngle[1] + dx;
			}
		}else 
		if(middleC)
		{
			if(isObject)
			{
				scaleFactor = Math.max(Math.min(scaleFactor + -dy*0.05, 2.0), 0.3);

			}else if(isObject2)
			{
				scaleFactor2 = Math.max(Math.min(scaleFactor2 + -dy*0.05, 2.0), 0.3);
			}
		}
		if(leftC)
		{
			if(isObject)
			{
				//console.log("object1 moves");
				transformV[0] = transformV[0] + dx*0.005*maxObjVal;
				transformV[1] = transformV[1] + dy*0.005*maxObjVal;
			}else if(isObject2)
			{
				//console.log("object2 moves");
				transformV2[0] = transformV2[0] + dx*0.005*maxObjVal2;
				transformV2[1] = transformV2[1] + dy*0.005*maxObjVal2;			
			}
			//console.log("isObject = ",isObject);
			//console.log("isObject2 = ",isObject2);
			if((!isObject)&&(!isObject2)){
				//console.log("cam is moving");
				camX = camX - dx*0.05;
				camY = camY + dy*0.05;
			}
		}
    }
    lastX = x, lastY = y;
  };
}

//checks to see if the mouse clicked on the object
function check(x, y) {
	var picked = false;
	//gl.uniform1i(u_Clicked, 1);  // Pass true to u_Clicked
	// Read pixel at the clicked position
	var pixels = new Uint8Array(4); // Array for storing the pixel value
	y = canvas.height - y;
	gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	//console.log("pixels = ",pixels);
	if (!(pixels[0] == 0&&pixels[1] == 0&&pixels[2] == 0)) // The mouse in on cube if R(pixels[0]) is 255
		picked = true;
	//gl.uniform1i(u_Clicked, 0);  // Pass false to u_Clicked(rewrite the cube)
	return picked;
}

//checks to see which object was clicked
function checkObject(x, y) {
	//gl.uniform1i(u_Clicked, 1);  // Pass true to u_Clicked
	// Read pixel at the clicked position
	var pixels = new Uint8Array(4); // Array for storing the pixel value
	y = canvas.height - y;
	gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	//console.log("pixels = ",pixels);
	//console.log("color = ",color);
	//console.log("color2 = ",color2);
	//console.log("pixels = ",pixels);
	if (pixels[0] == 0||pixels[1] == 0||pixels[2] == 0)
	{
		if(pixels[0]>0&&pixels[1]==0&&pixels[2]==0)
		{
			//console.log("picked 1");
			isObject = true;
			isObject2 = false;
		}
		else if(pixels[0]==0&&pixels[1]==0&&pixels[2]>0)
		{	
			//console.log("picked 2");
			isObject2 = true;
			isObject = false;
		}
		else
		{
			isObject2 = false;
			isObject = false;
		}
			//console.log("nothing picked");
	}
	return pixels;
}


//Sams face normal function code for getting the face normal from piazza
//link: https://docs.google.com/document/d/1Vq78KuC2Pv2pvrHWio7FGuEb2dmYVFOlIBpiCiG_7FE/edit
function getFaceNormal(tempIndexArray, extractedVertices)
{

	var vertexIndexXYZ1 = tempIndexArray[0] * 3;
	var vertexIndexXYZ2 = tempIndexArray[1] * 3;
	var vertexIndexXYZ3 = tempIndexArray[2] * 3;
		
	var Ax = extractedVertices[vertexIndexXYZ1];
	var Ay = extractedVertices[vertexIndexXYZ1 + 1];
	var Az = extractedVertices[vertexIndexXYZ1 + 2];
		
	var Bx = extractedVertices[vertexIndexXYZ2];
	var By = extractedVertices[vertexIndexXYZ2 + 1];
	var Bz = extractedVertices[vertexIndexXYZ2 + 2];
	
	
	var Cx = extractedVertices[vertexIndexXYZ3];
	var Cy = extractedVertices[vertexIndexXYZ3 + 1];
	var Cz = extractedVertices[vertexIndexXYZ3 + 2];
	
	/*	
	//B-A
	var BAx = Bx - Ax;
	var BAy = By - Ay;
	var BAz = Bz - Az;
	
	//C-A
	var CAx = Cx - Ax;
	var CAy = Cy - Ay;
	var CAz = Cz - Az;
	*/
	//B-A
	var ABx = Ax - Bx;
	var ABy = Ay - By;
	var ABz = Az - Bz;
	
	//C-A
	var CBx = Cx - Bx;
	var CBy = Cy - By;
	var CBz = Cz - Bz;
	/*	
	//(B-A)  X (C-A) => BA  X  CA
	
	var nX = BAy * CAz - BAz * CAy;
	var nY = BAz * CAx - BAx * CAz;
	var nZ = BAx * CAy - BAy * CAx;
	* 
	* */
	//C-B X B-A
	
	var nX = CBy * ABz - CBz * ABy;
	var nY = CBz * ABx - CBx * ABz;
	var nZ = CBx * ABy - CBy * ABx;
	
	//get magnitude of the normal
	var mag = Math.sqrt(nX*nX + nY*nY + nZ*nZ);
	
	
	//normalize
	nX = nX/mag;
	nY = nY/mag;
	nZ = nZ/mag;
	
	faceNormal =[nX, nY, nZ];
	
	return faceNormal;
}
