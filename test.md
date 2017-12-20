**Magic title**
				Author

Why is there no TOC?

Introduction
============
This one seems broken,

Intro-introduction
------------------
This one too seems broken,

# Crazy1
Word.

## Crazy2
Word.

### Crazy3
Word.

[Link-test](https://www.google.com)
![Image-test](https://www.google.se/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)


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


Optimize "random point on plane" found in [tweet](https://twitter.com/Donzanoid/status/943221772958257154):

~~~~~~~~~~~~~~~~~~~~
float3 RandomPointOnPlane(plane p)
{
    float3 x = RandomPoint();
    if (distance(p, x) > 0)
        return RandomPointOnPlane(p);
    return x;
}
~~~~~~~~~~~~~~~~~~~~
