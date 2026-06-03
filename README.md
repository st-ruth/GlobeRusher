# Globerusher

Globerusher is an interactive country dashboard where users can search and filter through all the countries of the world, as well as test their knowledge using a dynamic quiz engine.

**Target group:** Fifth graders learning geography, or anyone who enjoys world trivia and quizzes.

## Links
- **Live Demo:** [Insert URL here]
- **GitHub Repository:** [Insert URL here]

## About the Project
This application is my final project for the JavaScript 1 course. While the core assignment was to build an interactive dashboard, I decided to expand the scope by adding a fully functional quiz mode. The core concept was inspired by creating an educational tool that could genuinely be used in a school environment to make learning geography engaging and fun.

## How to Run Locally
1. Clone this repository:
   git clone [Insert Repository URL]
2. Navigate into the project folder:
   cd [Insert Folder Name]
3. Open index.html in your browser (or use the Live Server extension in VS Code for an optimized development experience).

## Technical Notes and Reflections:
Separation of Concerns
Currently, a small amount of CSS styling is applied directly inside the JavaScript file (specifically within the Toast notification system and dynamic search inputs using `style.cssText`). This approach was chosen for rapid implementation during development. A future improvement to achieve a cleaner separation of concerns would be to migrate all styling to the external stylesheet and exclusively handle visual states by toggling classes via `classList`.


### Lighthouse Analysis and Roadmap
A Google Lighthouse audit yielded the following metrics:
* **Accessibility:** 100/100
* **SEO:** 90/100
* **Best Practices:** 77/100
* **Performance:** 71/100

The current performance score of 71 is a result of the application rendering all 250+ country cards simultaneously upon initialization. Since each card utilizes double image elements to support the CSS flip animations, this results in a heavy initial DOM load. Native HTML lazy loading has been implemented to mitigate this impact.

Due to project time constraints, the following optimizations are deferred to future development:
* **Pagination or Infinite Scroll:** Render a base threshold of 20 cards initially and load more on scroll or click to drastically reduce initial DOM size.
* **Image Compression:** Convert the external API images to a lighter WebP format to reduce the network payload.
* **Layout Shifts (CLS):** Set explicit width and height attributes on dynamic images to prevent the layout from shifting during render.
