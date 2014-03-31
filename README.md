gimbalcube
==========
2014 - Cooper Brislain

This is a 3D cube using CSS3 3d-transforms and matrix rotation.

This project demonstrates rotation of web elements inside of a container dom element using 3D transforms.
Mouse or touch interactions rotate the object around the the x and y axis relative to the user's perspective and
the orientation of the container at the beginning of the drag motion. Transformation matrices are used rather than
Euler angles to avoid gimbal lock. Sylvester.js is used to perform matrix operations. 

Other functionality:

When a face is clicked, it expands away from the cube to "open". When the back face is clicked while open, the cube
resets to its original position. This is accomplished using CSS3 transitions. 
