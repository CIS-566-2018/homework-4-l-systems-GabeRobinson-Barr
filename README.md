# Homework 4: L-systems

Gabriel Robinson-Barr

Here is a link to my Github Pages:
https://gaberobinson-barr.github.io/homework-4-l-systems-GabeRobinson-Barr/

## Info about my l-systems
I created palm trees for this project.
Each tree starts with a 'root' that gets passed to the Expander class. The one I use is just a simple 'R' which is just a single root in my grammar.
Then calling Expander.expandSeed with the iterations I wanted to expand will store the expanded tree string in the expander object. All the rules for growing the tree are in the expander class. There are comments explaining what each character can expand into, but the basic idea is that a Root grows the trunk underneath it, the Root also can spawn Large Leaf tips, and Coconuts.
Large Leaf tips grow Large leaf sections behind them, these sections can spawn Small Leaf tips, and those leaf tips similarly to the large ones, will grow small leaf sections behind them.
Coconuts can grow a bit larger over time as well.

After expanding the string, it gets passed to the Parser class which goes through each character in the expanded string, and determines its size, orientation, vbo data and so on with the help of the Turtle class, which is pretty standard.
The parser will hold all the vbo data for the tree so that a tree drawable can be created for the expanded string at any time.

The modifiable elements of the GUI are the "Add Tree button" which you can guess, just adds another tree to the scene.
You can set the number of iterations that the expander will use to expand the string, lower numbers will result in a smaller tree, larger numbers will result in the opposite. I find that 15 iterations provides a decent looking tree most of the time.
The last modifiable part is the "Weeping Willow" mode, which turns the palm tree into something that looks more like a weeping willow than a palm tree. Code wise is is essentially just adding 20 iterations to whatever number the iterations slider is set to. Because of the way the expander expands the string over really high iterations the tree starts to look more like a weeping willow at 30+ iterations. As a note, having this mode enabled will take longer to expand, so you might have to wait a few seconds after reseting the scene or adding a tree.

As of right now I haven't tested the obj loader yet. In theory it should work if you type in the path to an obj file in the OBJName part of the GUI, but I have like 3 coding projects to finish including hw 5 for this class, and I haven't slept in a long time so if this note is still here in the final commit, it probably means that I didn't end up having time to come back and test it properly so it might not work. There is a decent chance that if it doesn't work its because I don't have textures enabled in my shaders and the obj file doesn't specify a color to use for the vertices. Just a heads up.



For this assignment, you will design a set of formal grammar rules to create
a plant life using an L-system program. Once again, you will work from a
Typescript / WebGL 2.0 base code like the one you used in homework 0. You will
implement your own set of classes to handle the L-system grammar expansion and
drawing. You will rasterize your L-system using faceted geometry. Feel free
to use ray marching to generate an interesting background, but trying to
raymarch an entire L-system will take too long to render!

## L-System Components
The way you implement your L-System is ultimately up to you, but we recommend
creating the following classes / constructs to help you instantiate, expand, and
draw your grammars:
* Some sort of expandable collection of string characters. You might implement
a linked list data structure, or you might use a basic Javascript array (which
is resizeable).
* Some sort of class to represent a Rule for expanding a character into a
string. You might consider creating a map within each Rule that maps
probabilities to strings, so that a Rule can represent multiple possible
expansions for a character with different probabilities.
* A second Rule-style class that dictates what drawing operation should be
performed when a character is parsed during the drawing process. This should
also be a map of probabilities, but this time the values in the map will be
functions rather than strings. Invoke a given function, e.g. `drawBranch`, when
a character is parsed.
* A Turtle class that lets you keep track of, at minimum, a position, an
orientation, and a depth. You should also create a stack onto which you can push
and pop turtle states.
* A class in which to store the VBOs that will represent __all__ of your faceted
geometry. __Do not draw individual mesh components one at a time. This will
cause your program to render very slowly.__ Instead, expand lists of vertex
information as you "draw" your grammar, and push all VBO data to the GPU at once
after you've finished parsing your entire string for drawing.

## OBJ loading
So that you can more easily generate interesting-looking plants, we ask that you
enable your program to import OBJ files and store their information in VBOs. You
can either implement your own OBJ parser, or use an OBJ-loading package via NPM:

[obj-mtl-loader](https://www.npmjs.com/package/obj-mtl-loader)

[webgl-obj-loader](https://www.npmjs.com/package/webgl-obj-loader)


## Aesthetic Requirements
Your plant must have the following attributes:
* It must grow in 3D
* It must have flowers, leaves, or some other branch decoration in addition to
basic branch geometry
* Organic variation (i.e. noise or randomness in grammar expansion)
* A flavorful twist. Don't just make a basic variation on the example broccoli
grammar from the slides! Create a plant that is unique to you!

Feel free to use the resources linked in the slides for inspiration!

## Interactivity
Using dat.GUI, make at least three aspects of your demo an interactive variable.
For example, you could modify:

* The axiom
* Your input grammar rules and their probability
* The angle of rotation of the turtle
* The size or color or material of the cylinder the turtle draws

Don't feel restricted to these examples; make any attributes adjustable that you
want!

## Examples from last year (Click to go to live demo)

Andrea Lin:

[![](andreaLin.png)](http://andrea-lin.com/Project3-LSystems/)

Tabatha Hickman:

[![](tabathaHickman.png)](https://tabathah.github.io/Project3-LSystems/)

Joe Klinger:

[![](joeKlinger.png)](https://klingerj.github.io/Project3-LSystems/)

## Extra Credit (Up to 20 points)
For bonus points, add functionality to your L-system drawing that ensures
geometry will never overlap. In other words, make your plant behave like a
real-life plant so that its branches and other components don't compete for the
same space. The more complex you make your L-system self-interaction, the more
points you'll earn.
