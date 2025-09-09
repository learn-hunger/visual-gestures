# Custom Events – Low-Level Value Definitions for Customization

This directory contains definitions of custom low-level values used by **visual-gestures.js** 
to detect and interpret finger movements. These values are computed directly from hand landmarks
returned by the hand-tracking model.

The purpose of this document is to make these formulas explicit so that users can understand and, 
if needed, customize or extend them.

## palmHeight
- Represents vertical size of human palm.  
- Defined as the "Weighted Euclidean distance" between wrist landmark and index finger MCP.  

**Formula:**

$$
\text{palmHeight} = d_w(\text{WRIST}, \text{INDEX.MCP}, \mathbf{w})
$$
where  
$$
d_w(p, q, \mathbf{w}) = \sqrt{ \sum_{i=1}^n w_i (p_i - q_i)^2 }
$$
and the weight vector is  
$$
\mathbf{w} = (w_x, w_y) = (0.5, 1.0)
$$

**Rationale:**  
The y-axis is weighted more heavily than the x-axis to better reflect real-world scenarios where 
vertical variation dominates palm height estimation.



## fingerHeight
- Represents the vertical length of a finger.
- Defined as the "Weighted Euclidean Distance" between the tip of the finger (here Index finger TIP) and its MCP.  

**Formula:** 

$$
\text{fingerHeight} = d_w(\text{INDEX.TIP}, \text{INDEX.MCP}, \mathbf{w})
$$
where  
$$
d_w(p, q, \mathbf{w}) = \sqrt{ \sum_{i=1}^n w_i (p_i - q_i)^2 }
$$
and the weight vector is  
$$
\mathbf{w} = (w_x, w_y) = (0.5, 1.0)
$$

**Rationale:**  
Similar to **palmHeight**, the y-axis is weighted more heavily than the x-axis, 
giving higher importance to vertical displacement when estimating finger length.


## fingerKinkRatio

The **fingerKinkRatio** is a novel metric designed to determine whether a human finger is 
folded or extended.  

**Formula:**  

$$
\text{fingerKinkRatio} = \frac{1000 \times \text{fingerHeight}}{\text{palmHeight}}
$$

**Properties:**  
1. Indicates the degree of finger folding/unfolding.   
2. Independent of the camera–hand distance (scale-invariant).  
3. Sensitive only to finger motion (closing/opening).  
4. Multiplication by 1000 normalizes the ratio into a convenient range (approximately **1–1000**).  

## MCPtoTIPDistance

Measures the weighted Euclidean distance between the MCP joint and the TIP of a finger.  

**Formula:**  

$$
d_{\text{MCP→TIP}}(f) = \sqrt{ w_x \cdot (x_{\text{TIP}} - x_{\text{MCP}})^2 + w_y \cdot (y_{\text{TIP}} - y_{\text{MCP}})^2 }
$$  

where for this implementation:  
- \( w_x = 0.5 \)  
- \( w_y = 1 \)  
- \( f \) = chosen finger (e.g., INDEX, MIDDLE, RING, PINKY, or THUMB)  

**Properties:**  
1. Provides a normalized distance measure accounting for hand pose.  
2. Y-axis is given higher weight (\(w_y > w_x\)) to better reflect real-world vertical hand motion.

## piecewiseDistance

- Computes the sum of weighted Euclidean distances between consecutive joints of a finger.
- Provides a more anatomically accurate measure of finger length by considering the finger as a chain of connected segments rather than a single MCP-to-TIP line.

**Formula:**  

For a given finger \( f \):  

$$
\text{PFD}(f) = d_{\text{MCP→PIP}}(f) + d_{\text{PIP→DIP}}(f) + d_{\text{DIP→TIP}}(f)
$$

where each segment distance is defined as:  

$$
d_{A \to B}(f) = \sqrt{ w_x \cdot (x_B - x_A)^2 + w_y \cdot (y_B - y_A)^2 }
$$

with:  
- MCP = Metacarpophalangeal joint  
- PIP = Proximal interphalangeal joint  
- DIP = Distal interphalangeal joint  
- TIP = Fingertip  
- \( w_x, w_y \) = axis weights (default: \( [1,1] \))  

**Properties:**  
1. Used as the **denominator** in the **Finger Open Ratio (FOR)**.  
2. More robust than a straight-line MCP→TIP distance, since it reflects natural bending of joints.  
3. Axis weights allow tuning sensitivity between horizontal and vertical motions.  

## Weighted Finger Open Ratio (WFOR)

- Quantifies how much a finger is **open (extended)** versus **closed (curled)**.  
- Defined as the ratio of the "Weighted Euclidean distance" between the MCP and TIP of a finger to the piecewise sum of distances along the finger segments (MCP → PIP → DIP → TIP).  

**Formula:**  

$$
\text{WFOR} = \frac{d(\text{MCP}, \text{TIP})}{d(\text{MCP}, \text{PIP}) + d(\text{PIP}, \text{DIP}) + d(\text{DIP}, \text{TIP})}
$$

where  

$$
d(a, b) = \sqrt{w_x (x_a - x_b)^2 + w_y (y_a - y_b)^2}
$$

is the Weighted Euclidean Distance between points \(a\) and \(b\), with weights \((w_x, w_y)\).  

**Interpretation:**  
- WFOR approx to 1 → finger is **fully open**.  
- WFOR approx to 0 → finger is **fully closed**.  
- Intermediate values indicate **partial openness**.  

## Thumb Closure Ratio (TCR)
>```javascript
>this.structuredLandmarks.state[finger] =
>          weightedEuclideanDistance(
>            this.structuredLandmarks.data["THUMB"].TIP,
>            this.structuredLandmarks.data["PINKY"].MCP,
>            [1, 0.25],
>          ) /
>          (weightedEuclideanDistance(
>            this.structuredLandmarks.data["THUMB"].TIP,
>            this.structuredLandmarks.data["INDEX"].MCP,
>            [1, 0.25],
>          ) +
>            weightedEuclideanDistance(
>              this.structuredLandmarks.data["INDEX"].MCP,
>              this.structuredLandmarks.data["PINKY"].MCP,
>              [1, 0.25],
>            )); 

- Normalized metric designed to quantify whether the thumb is folded into the palm or extended outward.  

**Formula:**  

$$
\text{TCR} = 
\frac{d(\text{THUMB}_{TIP}, \text{PINKY}_{MCP})}
     {d(\text{THUMB}_{TIP}, \text{INDEX}_{MCP}) + d(\text{INDEX}_{MCP}, \text{PINKY}_{MCP})}
$$

where:  
- \( d(A, B) \) is the "Weighted Euclidean Distance" between points \( A \) and \( B \):  

$$
d(A, B) = \sqrt{ w_x \cdot (x_B - x_A)^2 + w_y \cdot (y_B - y_A)^2 }
$$  

with default weights \( (w_x, w_y) = (1, 0.25) \), prioritizing horizontal movements.  

**Interpretation:**  
- **High TCR:** Thumb extended away from the palm.  
- **Low TCR:** Thumb folded inward toward the palm.  

**Properties:**  
1. Invariant to hand size and distance from the camera (scale normalized).  
2. Specifically designed for distinguishing **thumb-closed vs thumb-open gestures**.

# References

- fingerKinkRatio, Weighted Finger Open Ratio (WFOR), Thumb Closure Ratio (TCR) are proposed by [Boddu Sri Pavan](https://github.com/BodduSriPavan-111) based on his empirical observations. 
- The weighted Euclidean distance implementation is inspired by [SciPy’s](https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.distance.euclidean.html) version, 
which supports optional weights per dimension when computing distances.

> @ARTICLE{2020SciPy-NMeth, </br>
>  author  = {Virtanen, Pauli and Gommers, Ralf and Oliphant, Travis E. and </br>
>            Haberland, Matt and Reddy, Tyler and Cournapeau, David and      </br>
>            Burovski, Evgeni and Peterson, Pearu and Weckesser, Warren and      </br>
>            Bright, Jonathan and {van der Walt}, St{\'e}fan J. and      </br>
>            Brett, Matthew and Wilson, Joshua and Millman, K. Jarrod and      </br>
>            Mayorov, Nikolay and Nelson, Andrew R. J. and Jones, Eric and      </br>
>            Kern, Robert and Larson, Eric and Carey, C J and      </br>
>            Polat, {\.I}lhan and Feng, Yu and Moore, Eric W. and      </br>
>            {VanderPlas}, Jake and Laxalde, Denis and Perktold, Josef and      </br>
>            Cimrman, Robert and Henriksen, Ian and Quintero, E. A. and      </br>
>            Harris, Charles R. and Archibald, Anne M. and      </br>
>            Ribeiro, Ant{\^o}nio H. and Pedregosa, Fabian and      </br>
>            {van Mulbregt}, Paul and {SciPy 1.0 Contributors}},      </br>
>  title   = {{{SciPy} 1.0: Fundamental Algorithms for Scientific      </br>
>            Computing in Python}},      </br>
>  journal = {Nature Methods},      </br>
>  year    = {2020},      </br>
>  volume  = {17},      </br>
>  pages   = {261--272},      </br>
>  adsurl  = {https://rdcu.be/b08Wh},      </br>
>  doi     = {10.1038/s41592-019-0686-2},      </br>
>}
