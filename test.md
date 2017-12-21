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

And some math formulas:

Embedded Math (not working yet)
===============================

Markdeep automatically includes [MathJax](http://mathjax.org) if your
document contains equations and you have an Internet connection. That means
you get the **full power of LaTeX, TeX, MathML, and AsciiMath notation**.
Just put math inside single or double dollar signs. 

$$ \Lo(X, \wo) = \Le(X, \wo) + \int_\Omega \Li(X, \wi) ~ f_X(\wi, \wo) ~ | \n \cdot \wi | ~ d\wi $$

You can also use LaTeX equation syntax directly to obtain numbered
equations:

\begin{equation}
e^{i \pi} + 1 = 0
\end{equation}

\begin{equation}
\mathbf{A}^{-1}\vec{b} = \vec{x}
\end{equation}

If you don't have equations in your document, then Markdeep won't
connect to the MathJax server. Either way, it runs MathJax after 
processing the rest of the document, so there is no delay.

Markdeep is smart enough to distinguish non-math use of dollar signs,
such as $2.00 and $4.00, US$5, and 3$. Inline
math requires consistent spaces (or punctuation) either outside or inside
of the LaTeX dollar signs to distinguish them from
regular text usage. Thus, the following all work:

- $x^2$
- $ x^2 $
- ($x^2$)
- ($ x^2 $)
- Variable $x^2$,
- Variable $ x^2 $
- Two $x$ vars $y$ on the same line
- Different spacing styles: $\theta_{x}$ vs. $ \theta_{y} $

Unless you've changed out the default MathJax processor, you can define 
your own LaTeX macros by executing `\newcommand` within dollar signs,
just as you would in LaTeX.  Markdeep provides a handful of commands
defined this way by default because they're things that I frequently 
need:

   Code            |   Symbol
-------------------|------------
 `\O(n)`           |  $\O(n)$
 `\mathbf{M}^\T`   |  $\mathbf{M}^\T$
 `45\degrees`      |  $45\degrees$
 `x \in \Real`     |  $x \in \Real$
 `x \in \Integer`  |  $x \in \Integer$
 `x \in \Boolean`  |  $x \in \Boolean$
 `x \in \Complex`  |  $x \in \Complex$
 `\n`              |  $\n$
 `\w`              |  $\w$
 `\wo`             |  $\wo$
 `\wi`             |  $\wi$
 `\wh`             |  $\wh$
 `\Li`             |  $\Li$
 `\Lo`             |  $\Lo$
 `\Lr`             |  $\Lr$
 `\Le`             |  $\Le$
 `10\un{m/s^2}`    |  $10\un{m/s^2}$

