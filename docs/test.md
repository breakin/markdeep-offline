**Magic title**
				Author

Notice the nice table of content.

Introduction
============
H1 header using ===.

Intro-introduction
------------------
H2 header using ---.

# Crazy1
Word.

## Crazy2
Word.

### Crazy3
Word.

[Link-test](https://www.google.com)

Here is an image:

![Image-test](https://www.google.se/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)

Lets try a diagram:

	***********************************************************
	* -------------.                                          *
	*   A          |                                          *
	*              v                                          *
	*            .----.                                       *
	* ---------->| +  +-+------------+                        *
	*   B        '----' |       D    |                        *
	*                   |         .--+--.                     *
	*                   |         | MAX +-------------->      *
	*                   v         '--+--'           F         *
	*                .-----.         |                        *
	* -------------->| AND +---------+                        *
	*   C            '-----'    E                             *
	*                                                         *
	***********************************************************


Optimized "random point on plane" found in [tweet](https://twitter.com/Donzanoid/status/943221772958257154):

~~~~~~~~~~~~~~~~~~~~
float3 RandomPointOnPlane(plane p)
{
    float3 x = RandomPoint();
    if (distance(p, x) > 0)
        return RandomPointOnPlane(p);
    return x;
}
~~~~~~~~~~~~~~~~~~~~
