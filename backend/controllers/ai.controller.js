const { OpenAI } = require('openai');

// Concept database for local query responses
const CONCEPT_DATABASE = {
  'css': `### 🎨 Cascading Style Sheets (CSS)

**CSS** is the language used to style an HTML document. It describes how HTML elements should be rendered on screen, paper, or in other media.

**Core CSS Concepts**:
1.  **Box Model**: The foundation of CSS layout. Consists of:
    *   *Content*: The text or image.
    *   *Padding*: Clears an area around the content (transparent).
    *   *Border*: Goes around the padding and content.
    *   *Margin*: Clears an area outside the border (transparent).
2.  **Flexbox Layout**: A one-dimensional layout model for distributing space and aligning items in a container (using \`display: flex\`).
3.  **CSS Grid**: A two-dimensional grid-based layout system that handles both columns and rows.
4.  **Media Queries**: Used to apply styles based on device characteristics (e.g., screen width: \`@media (max-width: 768px)\`).`,

  'html': `### 📄 HyperText Markup Language (HTML)

**HTML** is the standard markup language for documents designed to be displayed in a web browser. It defines the structure and content of a web page using a series of elements/tags.

**Core HTML Structure**:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>Student Page</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a paragraph.</p>
</body>
</html>
\`\`\``,

  'react': `### ⚛️ Understanding React.js State & Hooks

In React, **State** is a built-in object used to store data or information about the component. A component's state can change over time; whenever it changes, the component re-renders.

**Core React Hooks**:
1.  **useState**: Allows you to add state to functional components.
    \`\`\`javascript
    const [count, setCount] = useState(0);
    \`\`\`
2.  **useEffect**: Handles side effects (data fetching, subscriptions, manual DOM changes).
    \`\`\`javascript
    useEffect(() => {
      // Runs once when component mounts
      fetchData();
    }, []);
    \`\`\`
3.  **useContext**: Subscribes to React context for global state access without prop drilling.`,

  'dijkstra': `### 🗺️ Dijkstra's Shortest Path Algorithm

**Dijkstra's Algorithm** is an algorithm for finding the shortest paths between nodes in a graph (which may represent, for example, road networks).

**Core Logic**:
1.  Initialize distances to all nodes as infinite, and the start node as 0.
2.  Set the start node as active.
3.  For the active node, consider all of its unvisited neighbors and calculate their tentative distances.
4.  Compare the newly calculated tentative distance to the current assigned value and assign the smaller one.
5.  When we are done considering all of the neighbors of the active node, mark the active node as visited.
6.  Select the unvisited node with the smallest tentative distance and set it as the new active node. Repeat.`,

  'deadlock': `### 🔒 Operating Systems: Deadlocks

A **Deadlock** is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by some other process.

**Four Coffman Conditions (Must hold simultaneously for deadlock to occur)**:
1.  **Mutual Exclusion**: At least one resource must be held in a non-shareable mode.
2.  **Hold and Wait**: A process must be holding at least one resource and waiting to acquire additional resources.
3.  **No Preemption**: Resources cannot be preempted; they can only be released voluntarily by the process holding them.
4.  **Circular Wait**: A set of processes must be waiting for each other in a circular chain (P0 waits for P1, P1 waits for P2... Pn waits for P0).`,

  'database': `### 🗄️ Database Normalization (DBMS)

**Normalization** is the process of organizing data in a database to reduce redundancy and improve data integrity.

**Normal Forms (NF)**:
*   **1NF (First Normal Form)**: All columns must contain atomic (indivisible) values, and entries in a column must be of the same data type.
*   **2NF (Second Normal Form)**: Must be in 1NF, and all non-key attributes must be fully functionally dependent on the primary key (no partial dependencies).
*   **3NF (Third Normal Form)**: Must be in 2NF, and no non-key attribute should be transitively dependent on the primary key.`,

  'sliding window': `### 🪟 Sliding Window Algorithm Pattern

The **Sliding Window Pattern** is a software design pattern used to perform an operation on a specific window size of a given buffer (like an array or a string) to solve problems efficiently (typically reducing \(O(n^2)\) checks to \(O(n)\) linear time).

**Common Use Case**: Finding the maximum sum subarray of size \`k\`.
\`\`\`javascript
function maxSubarraySum(arr, k) {
  let maxSum = 0, windowSum = 0;
  // Initialize first window sum
  for (let i = 0; i < k; i++) windowSum += arr[i];
  maxSum = windowSum;
  
  // Slide the window across the array
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k]; // Add next element, subtract first element of previous window
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
\`\`\``,

  'machine learning': `### 🤖 Machine Learning (ML)

**Machine Learning** is a branch of Artificial Intelligence (AI) that focuses on building applications that learn from data and improve their accuracy over time without being explicitly programmed.

**Key ML Paradigms**:
1.  **Supervised Learning**: The model is trained on labeled data (e.g., Regression like Linear Regression, Classification like Support Vector Machines or Logistic Regression).
2.  **Unsupervised Learning**: The model finds hidden patterns in unlabeled data (e.g., Clustering like K-Means, Dimensionality Reduction like PCA).
3.  **Reinforcement Learning**: The model learns by trial-and-error to maximize a reward signal (e.g., Q-Learning, Deep Q Networks).`,

  'ml': `### 🤖 Machine Learning (ML)

**Machine Learning** is a branch of Artificial Intelligence (AI) that focuses on building applications that learn from data and improve their accuracy over time without being explicitly programmed.

**Key ML Paradigms**:
1.  **Supervised Learning**: The model is trained on labeled data (e.g., Regression, Classification).
2.  **Unsupervised Learning**: The model finds hidden patterns in unlabeled data (e.g., Clustering like K-Means, Dimensionality Reduction like PCA).
3.  **Reinforcement Learning**: The model learns by trial-and-error to maximize a reward signal (e.g., Q-Learning, Deep Q Networks).`,

  'artificial intelligence': `### 🧠 Artificial Intelligence (AI)

**Artificial Intelligence** refers to the simulation of human intelligence in machines that are programmed to think and learn like humans.

**Core Subfields of AI**:
1.  **Machine Learning (ML)**: Statistical techniques enabling machines to learn from data.
2.  **Deep Learning (DL)**: Neural network architectures mimicking biological brains (e.g., CNNs for images, RNNs/Transformers for text).
3.  **Natural Language Processing (NLP)**: Enabling computers to understand and process human languages (e.g., sentiment analysis, translation, LLMs).
4.  **Computer Vision**: Enabling computers to extract information from digital images or videos.`,

  'ai': `### 🧠 Artificial Intelligence (AI)

**Artificial Intelligence** refers to the simulation of human intelligence in machines that are programmed to think and learn like humans.

**Core Subfields of AI**:
1.  **Machine Learning (ML)**: Statistical techniques enabling machines to learn from data.
2.  **Deep Learning (DL)**: Neural network architectures mimicking biological brains (e.g., CNNs for images, RNNs/Transformers for text).
3.  **Natural Language Processing (NLP)**: Enabling computers to understand and process human languages (e.g., sentiment analysis, translation, LLMs).
4.  **Computer Vision**: Enabling computers to extract information from digital images or videos.`,

  'python': `### 🐍 Python Programming

**Python** is an interpreted, high-level, general-purpose programming language known for its readability and clean syntax.

**Key Features**:
*   *Dynamically Typed*: Variable types are determined at runtime.
*   *Memory Management*: Uses automatic garbage collection.
*   *Extensive Ecosystem*: Rich libraries for data analysis (Pandas, NumPy) and machine learning (scikit-learn, PyTorch, TensorFlow).

**Simple Example**:
\`\`\`python
# List comprehension in Python
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers if x % 2 == 0]
print(squares) # Output: [4, 16]
\`\`\``,

  'java': `### ☕ Java Programming Language

**Java** is a class-based, object-oriented programming language designed to have as few implementation dependencies as possible ("Write Once, Run Anywhere" via JVM).

**Core OOP Pillars in Java**:
1.  **Encapsulation**: Hiding internal state via private variables and public getters/setters.
2.  **Inheritance**: Subclasses inheriting fields and methods from superclasses (\`extends\`).
3.  **Polymorphism**: Method Overloading (compile-time) and Method Overriding (runtime).
4.  **Abstraction**: Hiding implementation details using interfaces and abstract classes.`,

  'javascript': `### 🌐 JavaScript (JS)

**JavaScript** is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions. It is best known as the scripting language for Web pages.

**Key Concepts**:
1.  **Asynchronous JS**: Handled via Callbacks, Promises, and \`async/await\`.
2.  **Closures**: A function bundled together with references to its surrounding state (lexical environment).
3.  **Prototypal Inheritance**: Objects inherit properties and methods from other objects via their prototype chain.`,

  'js': `### 🌐 JavaScript (JS)

**JavaScript** is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions. It is best known as the scripting language for Web pages.

**Key Concepts**:
1.  **Asynchronous JS**: Handled via Callbacks, Promises, and \`async/await\`.
2.  **Closures**: A function bundled together with references to its surrounding state (lexical environment).
3.  **Prototypal Inheritance**: Objects inherit properties and methods from other objects via their prototype chain.`,

  'c++': `### ⚡ C++ Programming Language

**C++** is a cross-platform language that can be used to create high-performance applications. It was developed by Bjarne Stroustrup as an extension to the C language.

**Key Concepts**:
*   *Manual Memory Management*: Using pointers, \`new\`, and \`delete\` (or modern smart pointers like \`std::unique_ptr\`, \`std::shared_ptr\`).
*   *Standard Template Library (STL)*: Includes vectors, lists, maps, queues, and standard algorithms.
*   *Object-Oriented + Procedural*: Multi-paradigm language.`,

  'cpp': `### ⚡ C++ Programming Language

**C++** is a cross-platform language that can be used to create high-performance applications. It was developed by Bjarne Stroustrup as an extension to the C language.

**Key Concepts**:
*   *Manual Memory Management*: Using pointers, \`new\`, and \`delete\` (or modern smart pointers like \`std::unique_ptr\`, \`std::shared_ptr\`).
*   *Standard Template Library (STL)*: Includes vectors, lists, maps, queues, and standard algorithms.
*   *Object-Oriented + Procedural*: Multi-paradigm language.`,

  'sql': `### 🛢️ Structured Query Language (SQL)

**SQL** is the standard language for relational database management systems (RDBMS) like PostgreSQL, MySQL, and SQL Server.

**Key Commands**:
*   *DDL (Data Definition Language)*: \`CREATE\`, \`ALTER\`, \`DROP\`.
*   *DML (Data Manipulation Language)*: \`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\`.
*   *Joins*:
    *   \`INNER JOIN\`: Returns records that have matching values in both tables.
    *   \`LEFT JOIN\`: Returns all records from the left table, and matched records from the right.`,

  'computer networks': `### 🌐 Computer Networks & Protocols

A **Computer Network** is a set of connected computers sharing resources. The foundation of modern internet architecture rests on protocol suites.

**OSI vs TCP/IP Layers**:
1.  **Application Layer**: HTTP, FTP, DNS, SMTP.
2.  **Transport Layer**: TCP (reliable connection-oriented) and UDP (unreliable connectionless).
3.  **Network Layer**: IP addressing and routing packets.
4.  **Data Link / Physical Layer**: Ethernet, Wi-Fi, switches, physical cables.`,

  'cn': `### 🌐 Computer Networks & Protocols

A **Computer Network** is a set of connected computers sharing resources. The foundation of modern internet architecture rests on protocol suites.

**OSI vs TCP/IP Layers**:
1.  **Application Layer**: HTTP, FTP, DNS, SMTP.
2.  **Transport Layer**: TCP (reliable connection-oriented) and UDP (unreliable connectionless).
3.  **Network Layer**: IP addressing and routing packets.
4.  **Data Link / Physical Layer**: Ethernet, Wi-Fi, switches, physical cables.`,

  'operating system': `### 💻 Operating Systems (OS)

An **Operating System** is system software that manages computer hardware, software resources, and provides common services for computer programs.

**Core Functions**:
1.  **Process Management**: CPU Scheduling algorithms (FIFO, Shortest Job First, Round Robin).
2.  **Memory Management**: Virtual Memory, Paging, Segmentation, and Thrashing.
3.  **File Systems**: Directory structures, access control, and storage allocation.`,

  'os': `### 💻 Operating Systems (OS)

An **Operating System** is system software that manages computer hardware, software resources, and provides common services for computer programs.

**Core Functions**:
1.  **Process Management**: CPU Scheduling algorithms (FIFO, Shortest Job First, Round Robin).
2.  **Memory Management**: Virtual Memory, Paging, Segmentation, and Thrashing.
3.  **File Systems**: Directory structures, access control, and storage allocation.`,

  'software engineering': `### ⚙️ Software Engineering Principles

**Software Engineering** is the systematic application of engineering principles to the development, operation, and maintenance of software.

**Key Concepts**:
*   **SDLC Models**: Waterfall, Agile (Scrum/Kanban), Spiral.
*   **SOLID Principles**:
    *   *S*: Single Responsibility
    *   *O*: Open/Closed
    *   *L*: Liskov Substitution
    *   *I*: Interface Segregation
    *   *D*: Dependency Inversion
*   **Design Patterns**: Creational (Singleton, Factory), Structural (Adapter, Decorator), Behavioral (Observer, Strategy).`,

  'se': `### ⚙️ Software Engineering Principles

**Software Engineering** is the systematic application of engineering principles to the development, operation, and maintenance of software.

**Key Concepts**:
*   **SDLC Models**: Waterfall, Agile (Scrum/Kanban), Spiral.
*   **SOLID Principles**:
    *   *S*: Single Responsibility
    *   *O*: Open/Closed
    *   *L*: Liskov Substitution
    *   *I*: Interface Segregation
    *   *D*: Dependency Inversion
*   **Design Patterns**: Creational (Singleton, Factory), Structural (Adapter, Decorator), Behavioral (Observer, Strategy).`,

  'cloud computing': `### ☁️ Cloud Computing

**Cloud Computing** is the on-demand availability of computer system resources, especially data storage and computing power, without direct active management by the user.

**Cloud Service Models**:
1.  **IaaS (Infrastructure as a Service)**: Renting virtualized servers, storage, networks (e.g., AWS EC2, GCP Compute Engine).
2.  **PaaS (Platform as a Service)**: Providing a runtime environment for deploying apps without managing hardware/OS (e.g., Heroku, AWS Elastic Beanstalk).
3.  **SaaS (Software as a Service)**: End-user applications delivered over the web (e.g., Google Workspace, Microsoft 365).`,

  'cloud': `### ☁️ Cloud Computing

**Cloud Computing** is the on-demand availability of computer system resources, especially data storage and computing power, without direct active management by the user.

**Cloud Service Models**:
1.  **IaaS (Infrastructure as a Service)**: Renting virtualized servers, storage, networks (e.g., AWS EC2, GCP Compute Engine).
2.  **PaaS (Platform as a Service)**: Providing a runtime environment for deploying apps without managing hardware/OS (e.g., Heroku, AWS Elastic Beanstalk).
3.  **SaaS (Software as a Service)**: End-user applications delivered over the web (e.g., Google Workspace, Microsoft 365).`,

  'data structures': `### 📊 Data Structures & Algorithms (DSA)

**Data Structures** are specialized formats for organizing, processing, retrieving, and storing data, while **Algorithms** are step-by-step procedures for calculations.

**Essential Data Structures**:
*   *Linear*: Arrays, Linked Lists, Stacks, Queues.
*   *Non-linear*: Trees (Binary Trees, BSTs, AVL Trees), Graphs (Represented via adjacency matrix or list).
*   *Hash Tables*: Fast lookup ($O(1)$ average time complexity) using a hash function.`,

  'dsa': `### 📊 Data Structures & Algorithms (DSA)

**Data Structures** are specialized formats for organizing, processing, retrieving, and storing data, while **Algorithms** are step-by-step procedures for calculations.

**Essential Data Structures**:
*   *Linear*: Arrays, Linked Lists, Stacks, Queues.
*   *Non-linear*: Trees (Binary Trees, BSTs, AVL Trees), Graphs (Represented via adjacency matrix or list).
*   *Hash Tables*: Fast lookup ($O(1)$ average time complexity) using a hash function.`
};

// Fallback responses for local processing
const getMockResponse = (message) => {
  const query = message.toLowerCase().trim().replace(/[?.,!]/g, '');

  // 1. First check for specific concepts matching CONCEPT_DATABASE keys
  for (let concept in CONCEPT_DATABASE) {
    if (query.includes(concept)) {
      return CONCEPT_DATABASE[concept];
    }
  }

  // 2. Conversational greetings and friendly chatter
  if (query === 'hi' || query === 'hello' || query === 'hey' || query === 'greetings') {
    return `Hello! I am Aegis AI, your College Student Companion. How can I help you study today? 

Feel free to ask me about core computer science topics like **CSS**, **HTML**, **React hooks**, **Dijkstra's algorithm**, **database normal forms**, or **operating system deadlocks**!`;
  }

  if (query.includes('how are you') || query.includes('how are u') || query.includes('how r u') || query.includes('how is it going')) {
    return `I am running smoothly and ready to assist! What academic concept or coding logic are we reviewing today?`;
  }

  if (query.includes('who are you') || query.includes('what is your name') || query.includes('what can you do')) {
    return `I am **Aegis AI**, your personal student companion. I can:
*   Explain complex computer science concepts simply.
*   Log and track your course attendance targets.
*   Calculate and predict GPAs/CGPAs.
*   Analyze uploaded PDFs to generate study summaries, flashcards, and quizzes.
*   Format clean resumes ready to save as PDFs.`;
  }

  if (query.includes('thank') || query.includes('thanks') || query.includes('awesome') || query.includes('great')) {
    return `You're welcome! Let me know if there's anything else you'd like to calculate or detail. Happy studying!`;
  }

  // 3. Placement / Interview Prep responses
  if (query.includes('interview') || query.includes('placement') || query.includes('mock interview')) {
    return `### 🎯 College Placement & Interview Prep Guide

Here is a tailor-made response to prepare you for your upcoming placement rounds:

1. **Aptitude & Logical Reasoning**: Focus on Quantitative Aptitude, Logical Reasoning, and Data Interpretation. Practice on platforms like Indiabix and GeeksforGeeks.
2. **Technical Rounds**:
   - **Data Structures & Algorithms (DSA)**: Arrays, Strings, Linked Lists, Trees, and Graphs.
   - **System Design**: Understand scalability, load balancers, caching, and database sharding.
   - **Core CS Subjects**: DBMS (SQL queries, normalization), Operating Systems (multithreading, memory management), and Computer Networks (TCP/IP model).
3. **Behavioral Round (HR)**: Use the **STAR method** (Situation, Task, Action, Result) to structure your answers.`;
  }

  // 4. GATE Preparation responses
  if (query.includes('gate') || query.includes('gate preparation') || query.includes('gate syllabus')) {
    return `### 📚 GATE (Graduate Aptitude Test in Engineering) Preparation Checklist

GATE prep requires structured planning. Here is your roadmap:
*   **Engineering Mathematics & General Aptitude**: Accounts for ~28% of total marks. Do not skip this!
*   **Core Computer Science Syllabus**:
    *   *Theory of Computation & Compiler Design*
    *   *Computer Organization & Architecture*
    *   *Database Management Systems (DBMS)*
    *   *Algorithms & Data Structures*
    *   *Computer Networks*
*   **Preparation Strategy**:
    1.  Complete 80% syllabus by October.
    2.  Start solving Previous Years Question Papers (PYQs) from November.
    3.  Attempt at least 15-20 mock tests.`;
  }

  // 5. General programming or doubt solving
  if (query.includes('code') || query.includes('program') || query.includes('function') || query.includes('bug')) {
    return `### 💻 Programming Assistant

Here is a breakdown of how to write modular, clean code:
-   **Single Responsibility Principle**: Ensure each function does only one thing.
-   **Error Handling**: Always wrap asynchronous calls or network operations in \`try/catch\` blocks.
-   **Self-Documenting Code**: Choose descriptive names over generic ones.

Example of a clean API handler in Node.js:
\`\`\`javascript
// Fetch user profile with proper error handling
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
\`\`\`
Let me know if you want me to write code or debug a specific script for you!`;
  }

  // 6. Generic Academic Subject query fallback (Only runs if academic indicators are present)
  if (query.includes('what is') || query.includes('explain') || query.includes('define') || query.includes('concept') || query.includes('subject')) {
    const topic = message.replace(/(what is|explain|tell me about|how to|about|define)/gi, '').trim();
    const topicName = topic || 'This subject';

    const templates = [
      `**${topicName}** represents a fundamental pillar of computer science and modern engineering. It encompasses core methodologies, operational standards, and design paradigms that enable systems to scale efficiently.
      
Key areas of focus typically include:
1.  **Architecture & Design**: Understanding structural layers and interfaces.
2.  **Implementation**: Translating specifications into functional code or configurations.
3.  **Optimization**: Tuning resources to achieve higher throughput and lower latency.`,

      `In academic curricula, **${topicName}** is studied to master the principles of modularity and system integration. It teaches developers and engineers how to break down complex challenges into manageable components.

Common modules cover:
*   *Theoretical Foundations*: The mathematical and logical backing.
*   *Practical Frameworks*: Modern industry-standard tools and workflows.
*   *Resource Management*: Allocating processes and bandwidth productively.`,

      `Studying **${topicName}** equips students with the analytical skills needed to model and design enterprise-level systems. It details both low-level operations and high-level architectural abstractions.

*   **Primary Benefit**: Reduces computational complexity and system redundancy.
*   **Best Practice**: Adhering to decoupled interfaces and strict contract validation.`
    ];

    // Pick a template based on the length of the topic name to make it deterministic but varied
    const index = Math.abs(topicName.length) % templates.length;
    const responseBody = templates[index];

    return `${responseBody}\n\n*💡 Tip: For specific custom study aids on **${topicName}**, try uploading slides or handouts in the **Notes Manager** sidebar to generate customized quizzes and flashcards automatically!*`;
  }

  // 7. Conversational Fallback (Default when no other rules match)
  return `I'm here to support your studies! Let me know if you want me to explain a coding logic (like *Dijkstra*), review the *GATE syllabus*, check *attendance targets*, or format a *resume*.

If you have lecture slides or notes on a topic, you can also upload them in the **Notes Manager** to generate summaries and flashcards!`;
};

// Main AI chat completion controller
exports.getChatResponse = async (req, res) => {
  const { message, history, aiProvider, customApiKey } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const provider = aiProvider || process.env.AI_PROVIDER || 'mock';
  const apiKey = customApiKey || (provider === 'openai' ? process.env.OPENAI_API_KEY : process.env.GEMINI_API_KEY);

  // If mock or if required key is missing
  if (provider === 'mock' || !apiKey) {
    const reply = getMockResponse(message);
    return res.json({ reply, provider: 'mock' });
  }

  try {
    if (provider === 'openai') {
      const openai = new OpenAI({ apiKey });
      const messages = [
        { role: 'system', content: 'You are a helpful, smart AI College Student Assistant chatbot. You help students with coding, academics, career guidance, study planning, resume reviews, and internship prep. Keep responses structured and formatted with Markdown.' },
        ...history.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: message }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7
      });

      return res.json({
        reply: response.choices[0].message.content,
        provider: 'openai'
      });

    } else if (provider === 'gemini') {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const chat = model.startChat({
        history: history.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        generationConfig: {
          maxOutputTokens: 2000,
        },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return res.json({
        reply: response.text(),
        provider: 'gemini'
      });
    }

    return res.json({ reply: getMockResponse(message), provider: 'mock' });

  } catch (error) {
    console.error('AI Error:', error);
    return res.status(500).json({
      error: 'Failed to communicate with AI API. Falling back to local helper.',
      reply: getMockResponse(message) + `\n\n*(Note: Received error from ${provider}: "${error.message}")*`,
      provider: 'mock'
    });
  }
};

// Extract summary, flashcards, and quizzes from note text
exports.generateNoteResources = async (req, res) => {
  const { text, fileName } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text content is required' });
  }

  const summary = `This document "${fileName}" covers key concepts and summaries of the subject. It details the core definitions, structures, and practical applications required for student review.`;
  
  const keyPoints = [
    "Introduction to the main terms and historical context outlined in the document.",
    "Detailed structure and analysis of processes described in the text.",
    "Best practices, core formulas, and methodologies.",
    "Real-world application examples and key takeaways for assignments/exams."
  ];

  const flashcards = [
    { question: "What is the primary objective of this topic?", answer: "To understand and implement the core theoretical concepts in practical applications." },
    { question: "What are the key dependencies discussed?", answer: "The integration of systematic inputs, process validation, and resource optimization." },
    { question: "Name the main tool/methodology suggested.", answer: "The standard structured model described in section 2 of the document." }
  ];

  const quiz = [
    {
      question: "Which of the following best describes the main theme of this note?",
      options: ["Theoretical Foundations", "Practical Industry Case Study", "Advanced Mathematical Proof", "Unrelated topics"],
      answerIndex: 0
    },
    {
      question: "What is the key criteria for successful implementation?",
      options: ["High cost investment", "Resource planning & continuous review", "Manual adjustments", "No planning required"],
      answerIndex: 1
    },
    {
      question: "Based on the text, what is the recommended next step?",
      options: ["Run automated validation tests", "Ignore guidelines", "Archive the document", "Proceed without review"],
      answerIndex: 0
    }
  ];

  const provider = process.env.AI_PROVIDER || 'mock';
  const apiKey = provider === 'openai' ? process.env.OPENAI_API_KEY : process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      if (provider === 'openai') {
        const openai = new OpenAI({ apiKey });
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an academic learning assistant. Analyze the text and return a JSON object with: summary (string), keyPoints (array of strings), flashcards (array of objects with question & answer), and quiz (array of objects with question, options array of 4 items, and answerIndex (0-3)). Make sure the response is valid JSON.'
            },
            {
              role: 'user',
              content: `Analyze this note text and generate study resources:\n\n${text.substring(0, 12000)}`
            }
          ],
          response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content);
        return res.json({
          summary: result.summary || summary,
          keyPoints: result.keyPoints || keyPoints,
          flashcards: result.flashcards || flashcards,
          quiz: result.quiz || quiz
        });
      } else if (provider === 'gemini') {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' }
        });

        const prompt = `Analyze this note text and generate study resources in JSON format. The JSON must contain fields:
        {
          "summary": "detailed summary text",
          "keyPoints": ["point 1", "point 2", "point 3"],
          "flashcards": [{"question": "q1", "answer": "a1"}, {"question": "q2", "answer": "a2"}],
          "quiz": [{"question": "q1", "options": ["opt0", "opt1", "opt2", "opt3"], "answerIndex": 0}]
        }
        Text: ${text.substring(0, 12000)}`;

        const result = await model.generateContent(prompt);
        const parsed = JSON.parse(result.response.text());
        return res.json(parsed);
      }
    } catch (e) {
      console.error('AI Note generation failed, using mock data:', e);
    }
  }

  return res.json({ summary, keyPoints, flashcards, quiz });
};
