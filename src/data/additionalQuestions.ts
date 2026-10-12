import { Question } from '../types';

export const ADDITIONAL_QUESTIONS: Question[] = [
  // ----------------------------------------------------
  // 1. Computer Fundamentals (Additional)
  // ----------------------------------------------------
  {
    id: 'cf-add-1',
    subject: 'computer-fundamentals',
    standard: 'Beginner',
    difficulty: 'easy',
    question: 'Which component is known as the "brain" of the computer that fetches, decodes, and executes instructions?',
    options: ['Central Processing Unit (CPU)', 'Power Supply Unit (PSU)', 'Heat Sink Fan', 'Solid State Drive (SSD)'],
    correctIndex: 0,
    explanation: 'The CPU performs all fundamental data processing, instruction fetching, decoding, and arithmetic/logical execution for the computer system.',
    wrongExplanations: {
      1: 'The PSU delivers electrical power to motherboard components.',
      2: 'Heat sinks dissipate thermal energy away from the processor silicon.',
      3: 'The SSD stores persistent files and operating system files.',
    },
  },
  {
    id: 'cf-add-2',
    subject: 'computer-fundamentals',
    standard: 'Class 9–10',
    difficulty: 'medium',
    question: 'What is the purpose of the Memory Data Register (MDR) in computer architecture?',
    options: [
      'Holding data fetched from memory or waiting to be written to memory',
      'Holding the memory address currently being accessed on the bus',
      'Counting the number of machine cycles elapsed',
      'Storing graphics texture pixels before display refresh',
    ],
    correctIndex: 0,
    explanation: 'The Memory Data Register (MDR), also called the Memory Buffer Register (MBR), holds the actual contents read from or ready to be written into main memory.',
    wrongExplanations: {
      1: 'Holding memory addresses is the role of the Memory Address Register (MAR).',
      2: 'Cycle counting is done by hardware timer circuits or performance counters.',
      3: 'Graphics pixels are held in the GPU VRAM frame buffer.',
    },
  },
  {
    id: 'cf-add-3',
    subject: 'computer-fundamentals',
    standard: 'Class 11–12',
    difficulty: 'medium',
    question: 'What is the primary difference between Static RAM (SRAM) and Dynamic RAM (DRAM)?',
    options: [
      'SRAM uses flip-flop latches and does not require periodic refresh, while DRAM uses capacitors that must be constantly refreshed',
      'DRAM is faster than SRAM and is used for CPU L1 cache',
      'SRAM stores data magnetically while DRAM stores data optically',
      'DRAM retains data permanently even when computer power is disconnected',
    ],
    correctIndex: 0,
    explanation: 'SRAM uses transistor flip-flops (typically 6 transistors per cell) which hold state without refreshing, making it fast but expensive. DRAM stores charge in capacitors that leak and must be refreshed millions of times per second.',
    wrongExplanations: {
      1: 'SRAM is significantly faster than DRAM; SRAM is used for L1/L2/L3 caches, while DRAM is used for main system RAM.',
      2: 'Neither SRAM nor DRAM uses magnetic or optical storage; both are silicon semiconductors.',
      3: 'DRAM is volatile and loses all stored charges when power is removed.',
    },
  },
  {
    id: 'cf-add-4',
    subject: 'computer-fundamentals',
    standard: 'College / B.Sc. Computer Science',
    difficulty: 'hard',
    question: 'In computer architecture, what is "Instruction Pipelining"?',
    options: [
      'An implementation technique where multiple instructions are overlapped in execution across distinct stages (Fetch, Decode, Execute)',
      'Compressing executable binaries into a pipeline stream before uploading to GitHub',
      'Connecting water cooling pipes directly across CPU heatsinks',
      'Routing network packets through Unix shell pipes (|)',
    ],
    correctIndex: 0,
    explanation: 'Pipelining divides instruction execution into discrete stages (e.g., IF, ID, EX, MEM, WB) allowing a CPU to process different execution phases of multiple instructions simultaneously each clock cycle.',
    wrongExplanations: {
      1: 'Binary compression is handled by archivers or packers like UPX.',
      2: 'Plumbing liquid cooling loops is hardware thermodynamics, not architectural pipelining.',
      3: 'Unix shell pipes transfer text streams between OS processes.',
    },
  },
  {
    id: 'cf-add-5',
    subject: 'computer-fundamentals',
    standard: 'Class 6–8',
    difficulty: 'easy',
    question: 'How many bits make up one standard byte?',
    options: ['8 bits', '4 bits', '16 bits', '32 bits'],
    correctIndex: 0,
    explanation: 'A byte is fundamentally composed of 8 binary bits (capable of representing 256 distinct integer values from 0 to 255).',
    wrongExplanations: {
      1: '4 bits is called a nibble or half-byte.',
      2: '16 bits is a 2-byte word (short integer).',
      3: '32 bits is a double word (4 bytes).',
    },
  },

  // ----------------------------------------------------
  // 2. Digital Electronics (Additional)
  // ----------------------------------------------------
  {
    id: 'de-add-1',
    subject: 'digital-electronics',
    standard: 'Class 11–12',
    difficulty: 'easy',
    question: 'Which logic gate outputs HIGH (1) if and only if its two inputs are different?',
    options: ['XOR Gate (Exclusive OR)', 'XNOR Gate', 'AND Gate', 'OR Gate'],
    correctIndex: 0,
    explanation: 'An XOR (Exclusive OR) gate yields 1 when the inputs are unequal (0,1 or 1,0), and outputs 0 when the inputs are identical (0,0 or 1,1).',
    wrongExplanations: {
      1: 'XNOR outputs 1 when both inputs are equal (equivalence gate).',
      2: 'AND gate outputs 1 only when both inputs are 1.',
      3: 'OR gate outputs 1 whenever at least one input is 1, including when both are 1.',
    },
  },
  {
    id: 'de-add-2',
    subject: 'digital-electronics',
    standard: 'Intermediate',
    difficulty: 'medium',
    question: 'What is a Demultiplexer (DEMUX)?',
    options: [
      'A combinational circuit that takes a single input line and routes it to one of multiple output lines based on select lines',
      'A circuit that combines multiple input channels into one single output line',
      'An analog device that changes direct current (DC) into alternating current (AC)',
      'A gate that checks whether an arithmetic register has overflowed',
    ],
    correctIndex: 0,
    explanation: 'A demultiplexer (DEMUX) acts as a data distributor: it takes one common data input line and switches it to one of 2^n output lines selected by n control select bits.',
    wrongExplanations: {
      1: 'Combining multiple inputs to one output line is a Multiplexer (MUX).',
      2: 'Converting DC to AC is an electrical power inverter.',
      3: 'Overflow checking is done by status flag registers in an ALU.',
    },
  },
  {
    id: 'de-add-3',
    subject: 'digital-electronics',
    standard: 'College / B.Sc. Computer Science',
    difficulty: 'hard',
    question: 'What is the "propagation delay" of a digital logic gate?',
    options: [
      'The time delay between a change in the input signal and the corresponding transition at the output',
      'The time taken for electrical current to travel through motherboard PCB traces at light speed',
      'The maximum clock frequency supported by the system BIOS',
      'The amount of power dissipated during sleep mode',
    ],
    correctIndex: 0,
    explanation: 'Propagation delay (t_pd) is the finite time required for a semiconductor transistor to switch states after input signals cross logic threshold voltages.',
    wrongExplanations: {
      1: 'Trace transit time is trace propagation velocity, not gate switching latency.',
      2: 'Clock frequency is determined by oscillators, limited by the critical path delay.',
      3: 'Power dissipation in sleep is static leakage current.',
    },
  },
  {
    id: 'de-add-4',
    subject: 'digital-electronics',
    standard: 'Beginner',
    difficulty: 'easy',
    question: 'What is the output of an OR gate when both inputs are 0?',
    options: ['0', '1', 'Undefined', 'High Impedance'],
    correctIndex: 0,
    explanation: 'An OR gate outputs 0 only when both inputs are 0. If either or both inputs are 1, it outputs 1.',
    wrongExplanations: {
      1: '1 would be the output of a NOR gate when both inputs are 0.',
      2: 'Standard logic gates have well-defined digital outputs.',
      3: 'High impedance only occurs on disconnected tri-state outputs.',
    },
  },

  // ----------------------------------------------------
  // 3. C Programming (Additional)
  // ----------------------------------------------------
  {
    id: 'c-add-1',
    subject: 'c-programming',
    standard: 'Intermediate',
    difficulty: 'medium',
    question: 'What is a "dangling pointer" in C?',
    options: [
      'A pointer that still points to a memory address after the allocated block has been freed or gone out of scope',
      'A pointer that has been explicitly initialized to NULL',
      'A pointer pointing to the first element of a global static array',
      'A function pointer that takes no parameters and returns void',
    ],
    correctIndex: 0,
    explanation: 'A dangling pointer points to deallocated (freed) memory. Dereferencing it leads to undefined behavior, data corruption, or segmentation faults.',
    wrongExplanations: {
      1: 'A pointer set to NULL is a safe null pointer.',
      2: 'A pointer to a static array is a valid live pointer.',
      3: 'A pointer to a function is a standard function pointer.',
    },
  },
  {
    id: 'c-add-2',
    subject: 'c-programming',
    standard: 'Beginner',
    difficulty: 'easy',
    question: 'Which header file must be included in C to use input/output functions like printf() and scanf()?',
    options: ['<stdio.h>', '<stdlib.h>', '<string.h>', '<math.h>'],
    correctIndex: 0,
    explanation: '`<stdio.h>` defines standard input and output macros, types, and functions like `printf`, `scanf`, `fopen`, and `fgets`.',
    wrongExplanations: {
      1: '`<stdlib.h>` declares memory management (malloc, free) and process control (exit).',
      2: '`<string.h>` provides string manipulation utilities (strlen, strcpy).',
      3: '`<math.h>` provides mathematical functions (sin, sqrt, pow).',
    },
  },
  {
    id: 'c-add-3',
    subject: 'c-programming',
    standard: 'Advanced',
    difficulty: 'hard',
    question: 'What does the function `calloc(n, size)` do differently compared to `malloc(n * size)`?',
    options: [
      '`calloc` allocates the memory and initializes all allocated bytes to zero',
      '`calloc` allocates memory in CPU registers instead of the heap',
      '`calloc` prevents the memory from ever being deallocated with `free()`',
      '`calloc` automatically resizes the memory buffer when it fills up',
    ],
    correctIndex: 0,
    explanation: '`calloc` allocates memory for an array of elements and zeroes out every byte in that memory range, whereas `malloc` leaves memory uninitialized with whatever garbage values existed before.',
    wrongExplanations: {
      1: '`calloc` allocates memory on the process heap, not registers.',
      2: 'Memory allocated with `calloc` must be freed with standard `free()`.',
      3: 'Dynamic resizing requires `realloc()`, not `calloc()`.',
    },
  },
  {
    id: 'c-add-4',
    subject: 'c-programming',
    standard: 'Class 11–12',
    difficulty: 'medium',
    question: 'What is the output of `5 / 2` in standard C when both operands are integers?',
    options: ['2', '2.5', '3', '0'],
    correctIndex: 0,
    explanation: 'In C, dividing two integer types performs integer division, which truncates the fractional part towards zero, yielding 2.',
    wrongExplanations: {
      1: '2.5 requires floating-point division (e.g. `5.0 / 2`).',
      2: '3 would imply rounding up (ceiling), which C integer division does not do.',
      3: '0 is the result of dividing smaller integers by larger integers (e.g. `2 / 5`).',
    },
  },

  // ----------------------------------------------------
  // 4. C++ (Additional)
  // ----------------------------------------------------
  {
    id: 'cpp-add-1',
    subject: 'cpp',
    standard: 'Intermediate',
    difficulty: 'medium',
    question: 'In C++, what is a "pure virtual function"?',
    options: [
      'A virtual function declared with `= 0` in a base class that must be overridden by concrete derived classes',
      'A function compiled without any inline assembly directives',
      'A template function that takes zero template arguments',
      'A constructor that takes no parameters',
    ],
    correctIndex: 0,
    explanation: 'A pure virtual function (`virtual void draw() = 0;`) makes the enclosing class an abstract base class that cannot be directly instantiated.',
    wrongExplanations: {
      1: 'Virtual functions can contain any valid C++ code or assembly.',
      2: 'Template functions with no parameters are nullary templates.',
      3: 'A constructor taking no arguments is a default constructor.',
    },
  },
  {
    id: 'cpp-add-2',
    subject: 'cpp',
    standard: 'Advanced',
    difficulty: 'hard',
    question: 'What was introduced in C++11 to eliminate expensive deep copies when returning temporary objects from functions?',
    options: ['Move Semantics and Rvalue References (&&)', 'Friend Classes', 'Static Casts', 'Macro Inlining'],
    correctIndex: 0,
    explanation: 'C++11 introduced rvalue references (`T&&`) and move constructors/assignment operators, allowing resources (like heap memory pointers) to be transferred rather than deep-copied.',
    wrongExplanations: {
      1: 'Friend classes grant member access, unrelated to memory transfers.',
      2: 'Static cast performs compile-time type conversions.',
      3: 'Macros do not perform resource transfer or ownership relocation.',
    },
  },
  {
    id: 'cpp-add-3',
    subject: 'cpp',
    standard: 'Beginner',
    difficulty: 'easy',
    question: 'Which operator in C++ is used to dynamically allocate memory on the heap and call the constructor?',
    options: ['new', 'malloc', 'allocate', 'create'],
    correctIndex: 0,
    explanation: 'The `new` operator allocates memory for an object on the heap and automatically calls its constructor to initialize it.',
    wrongExplanations: {
      1: '`malloc` is C heritage that allocates raw bytes without calling C++ constructors.',
      2: '`allocate` is a member of `std::allocator`, not the primary language operator.',
      3: '`create` is not a C++ keyword.',
    },
  },

  // ----------------------------------------------------
  // 5. Python Programming (Additional)
  // ----------------------------------------------------
  {
    id: 'py-add-1',
    subject: 'python',
    standard: 'Beginner',
    difficulty: 'easy',
    question: 'What is the output of `print("Python"[1:4])` in Python?',
    options: ["'yth'", "'ytho'", "'Pyt'", "'y'"],
    correctIndex: 0,
    explanation: 'String slicing `[1:4]` starts at index 1 (\'y\') and ends before index 4 (\'h\'), yielding \'yth\'.',
    wrongExplanations: {
      1: "'ytho' would be slice `[1:5]`.",
      2: "'Pyt' would be slice `[0:3]`.",
      3: "'y' is just index `[1]`.",
    },
  },
  {
    id: 'py-add-2',
    subject: 'python',
    standard: 'Intermediate',
    difficulty: 'medium',
    question: 'In Python, what is the difference between `==` and `is`?',
    options: [
      '`==` compares values for equality, while `is` checks whether two variables refer to the exact same object in memory',
      '`==` checks identity, while `is` checks data type',
      '`is` converts both sides to strings before comparing',
      '`==` is deprecated in Python 3 in favor of `is`',
    ],
    correctIndex: 0,
    explanation: '`==` invokes `__eq__` to compare value equality. `is` checks identity (whether `id(a) == id(b)`), confirming they occupy the same memory address.',
    wrongExplanations: {
      1: '`==` compares value, not identity.',
      2: '`is` does not convert anything to strings.',
      3: '`==` is standard and widely used throughout Python.',
    },
  },
  {
    id: 'py-add-3',
    subject: 'python',
    standard: 'Advanced',
    difficulty: 'hard',
    question: 'What are Python "dunder" methods like `__init__`, `__str__`, and `__len__` formally known as?',
    options: ['Special or Magic Methods', 'Ghost Functions', 'Kernel Directives', 'Private Dynamic Macros'],
    correctIndex: 0,
    explanation: 'Double-underscore ("dunder") methods are Python\'s special methods (or data model magic methods) that hook into built-in operators and protocols.',
    wrongExplanations: {
      1: 'Ghost Functions is a fabricated phrase.',
      2: 'Kernel directives belong to operating systems.',
      3: 'Python does not use C-style preprocessor macros.',
    },
  },

  // ----------------------------------------------------
  // 6. Java Programming (Additional)
  // ----------------------------------------------------
  {
    id: 'java-add-1',
    subject: 'java',
    standard: 'Beginner',
    difficulty: 'easy',
    question: 'What is the size of a primitive `int` data type in Java across all operating systems?',
    options: ['4 bytes (32 bits)', '2 bytes (16 bits)', '8 bytes (64 bits)', '1 byte (8 bits)'],
    correctIndex: 0,
    explanation: 'Java guarantees that primitive `int` is always signed 32-bit (4 bytes) regardless of the underlying hardware architecture, ensuring portability.',
    wrongExplanations: {
      1: '2 bytes is the size of `short` and `char`.',
      2: '8 bytes is the size of `long` and `double`.',
      3: '1 byte is the size of `byte`.',
    },
  },
  {
    id: 'java-add-2',
    subject: 'java',
    standard: 'Intermediate',
    difficulty: 'medium',
    question: 'Which collection in Java preserves the insertion order of elements while preventing duplicates?',
    options: ['LinkedHashSet', 'HashSet', 'TreeSet', 'ArrayList'],
    correctIndex: 0,
    explanation: '`LinkedHashSet` uses a doubly-linked list running across its hash buckets to maintain insertion order while enforcing uniqueness like a Set.',
    wrongExplanations: {
      1: '`HashSet` does not guarantee any iteration order.',
      2: '`TreeSet` sorts elements in natural sorted order, not insertion order.',
      3: '`ArrayList` allows duplicate elements.',
    },
  },
  {
    id: 'java-add-3',
    subject: 'java',
    standard: 'Advanced',
    difficulty: 'hard',
    question: 'What is the purpose of the `try-with-resources` statement introduced in Java 7?',
    options: [
      'Automatically closes resources that implement `AutoCloseable` when the try block exits',
      'Catches unchecked runtime errors before compilation finishes',
      'Allocates memory on GPU tensor cores',
      'Prevents any subclass from catching exceptions',
    ],
    correctIndex: 0,
    explanation: '`try-with-resources` ensures each opened resource (like FileInputStream or Socket) is closed at the end of the statement, eliminating boilerplates in `finally` blocks.',
    wrongExplanations: {
      1: 'Runtime exceptions are caught at execution time, not compile time.',
      2: 'Java does not natively manage GPU tensor allocations via try blocks.',
      3: 'Subclasses catch whatever exceptions they declare.',
    },
  },

  // ----------------------------------------------------
  // 7. Data Structures and Algorithms (Additional)
  // ----------------------------------------------------
  {
    id: 'dsa-add-1',
    subject: 'dsa',
    standard: 'Intermediate',
    difficulty: 'medium',
    question: 'What is the time complexity of pushing an element onto an array-based Stack of capacity n when resizing is not needed?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctIndex: 0,
    explanation: 'Pushing to a stack with available capacity is O(1) constant time, as it simply places the element at `arr[top]` and increments `top`.',
    wrongExplanations: {
      1: 'O(n) occurs only during dynamic array reallocation and copying.',
      2: 'O(log n) is binary search or heap push.',
      3: 'O(n log n) is sorting complexity.',
    },
  },
  {
    id: 'dsa-add-2',
    subject: 'dsa',
    standard: 'College / B.Sc. Computer Science',
    difficulty: 'hard',
    question: 'Which graph traversal algorithm uses a First-In, First-Out (FIFO) Queue?',
    options: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Topological Sort with DFS', 'Tarjan’s Strongly Connected Components'],
    correctIndex: 0,
    explanation: 'Breadth-First Search explores all neighbor nodes at the present depth level before moving on to nodes at the next depth level using a FIFO queue.',
    wrongExplanations: {
      1: 'Depth-First Search (DFS) uses a LIFO Stack (or recursion call stack).',
      2: 'Topological Sort with DFS relies on post-order recursion stacks.',
      3: 'Tarjan\'s algorithm uses a DFS exploration stack.',
    },
  },
  {
    id: 'dsa-add-3',
    subject: 'dsa',
    standard: 'Class 9–10',
    difficulty: 'easy',
    question: 'In which tree traversal are the nodes visited in the order: Left Child, Parent, Right Child?',
    options: ['In-order Traversal', 'Pre-order Traversal', 'Post-order Traversal', 'Level-order Traversal'],
    correctIndex: 0,
    explanation: 'In-order traversal visits Left Subtree → Root Node → Right Subtree. On a Binary Search Tree (BST), this visits all keys in sorted ascending order.',
    wrongExplanations: {
      1: 'Pre-order visits Root → Left → Right.',
      2: 'Post-order visits Left → Right → Root.',
      3: 'Level-order visits nodes row by row from top to bottom.',
    },
  },

  // ----------------------------------------------------
  // 8. DBMS (Additional)
  // ----------------------------------------------------
  {
    id: 'dbms-add-1',
    subject: 'dbms',
    standard: 'Beginner',
    difficulty: 'easy',
    question: 'Which SQL statement is used to insert new rows into a database table?',
    options: ['INSERT INTO', 'ADD ROW', 'UPDATE', 'CREATE ROW'],
    correctIndex: 0,
    explanation: '`INSERT INTO table_name (col1, col2) VALUES (val1, val2);` is the standard SQL Data Manipulation Language command for adding records.',
    wrongExplanations: {
      1: '`ADD ROW` is not standard SQL.',
      2: '`UPDATE` modifies existing records.',
      3: '`CREATE ROW` is invalid SQL.',
    },
  },
  {
    id: 'dbms-add-2',
    subject: 'dbms',
    standard: 'Intermediate',
    difficulty: 'medium',
    question: 'What is a Foreign Key in relational database design?',
    options: [
      'A column in one table that references the primary key of another table, enforcing referential integrity',
      'A key used by offshore database administrators to log in via VPN',
      'A database index containing only non-ASCII characters',
      'A backup encryption key stored on an external USB device',
    ],
    correctIndex: 0,
    explanation: 'A Foreign Key creates a relationship between two tables, ensuring that values in the child table correspond to valid primary keys in the parent table.',
    wrongExplanations: {
      1: 'Database user login credentials are user accounts, not relational foreign keys.',
      2: 'Index character sets refer to collation, not key relationships.',
      3: 'USB backup keys are security keys, not database schema keys.',
    },
  },
  {
    id: 'dbms-add-3',
    subject: 'dbms',
    standard: 'Advanced',
    difficulty: 'hard',
    question: 'In PostgreSQL and modern SQL systems, what does WAL stand for in database crash recovery?',
    options: ['Write-Ahead Logging', 'Wide Access Layer', 'Web Authentication Link', 'Worker Allocation Loop'],
    correctIndex: 0,
    explanation: 'Write-Ahead Logging (WAL) ensures that changes to data pages are written to non-volatile disk logs before changes are applied to the database files, guaranteeing durability.',
    wrongExplanations: {
      1: 'Wide Access Layer is a made-up term.',
      2: 'Web Authentication Link relates to web sessions.',
      3: 'Worker Allocation Loop is CPU scheduling terminology.',
    },
  },

  // ----------------------------------------------------
  // 9. Operating Systems (Additional)
  // ----------------------------------------------------
  {
    id: 'os-add-1',
    subject: 'operating-systems',
    standard: 'Beginner',
    difficulty: 'easy',
    question: 'What happens during a "Context Switch" in an operating system?',
    options: [
      'The CPU saves the state of the currently executing process and loads the saved state of another process',
      'The monitor switches from dark mode to light mode',
      'The hard drive shifts from SATA mode to NVMe mode',
      'The user switches keyboards from QWERTY to Dvorak',
    ],
    correctIndex: 0,
    explanation: 'A context switch saves process registers and program counters into the PCB (Process Control Block) and restores the state of the next scheduled process to allow multitasking.',
    wrongExplanations: {
      1: 'Display themes are UI CSS/graphics settings, not CPU context switches.',
      2: 'Drive interfaces are hardware protocols.',
      3: 'Keyboard layouts are input mapping settings.',
    },
  },
  {
    id: 'os-add-2',
    subject: 'operating-systems',
    standard: 'Intermediate',
    difficulty: 'medium',
    question: 'What is a "Race Condition" in concurrent programming?',
    options: [
      'A situation where two or more threads access shared data concurrently and the final result depends on the order/timing of execution',
      'A competition between two computer brands to run benchmark tests',
      'A network socket timing out when downloading large video files',
      'A processor overclocking contest sponsored by hardware vendors',
    ],
    correctIndex: 0,
    explanation: 'Race conditions occur when asynchronous threads modify shared resources without proper synchronization locks, causing unpredictable bugs depending on thread scheduling.',
    wrongExplanations: {
      1: 'Hardware vendor benchmarks are performance tests, not race condition bugs.',
      2: 'Socket timeouts are network latency events.',
      3: 'Overclocking contests are hardware hobbyist events.',
    },
  },
  {
    id: 'os-add-3',
    subject: 'operating-systems',
    standard: 'College / B.Sc. Computer Science',
    difficulty: 'hard',
    question: 'In virtual memory systems, what is a "Page Fault"?',
    options: [
      'An interrupt generated when an executing program accesses a virtual page that is not currently mapped into physical RAM',
      'A printed paper error on an ink printer',
      'A corrupted CSS stylesheet on a web page',
      'A defect in an optical scanner glass bed',
    ],
    correctIndex: 0,
    explanation: 'When a process accesses a page marked non-present in its page table, the CPU generates a Page Fault exception, prompting the OS kernel to fetch the page from disk swap space into RAM.',
    wrongExplanations: {
      1: 'Printer errors are hardware paper jam events.',
      2: 'Broken CSS is frontend web layout rendering.',
      3: 'Scanner glass scratches are optical defects.',
    },
  },

  // ----------------------------------------------------
  // 10. Computer Networks (Additional)
  // ----------------------------------------------------
  {
    id: 'cn-add-1',
    subject: 'computer-networks',
    standard: 'Beginner',
    difficulty: 'easy',
    question: 'What does the acronym LAN stand for in computer networking?',
    options: ['Local Area Network', 'Logical Access Node', 'Longitudinal Array Network', 'Linked Address Number'],
    correctIndex: 0,
    explanation: 'A Local Area Network (LAN) interconnects computers within a limited physical area, such as a residence, school, laboratory, or office building.',
    wrongExplanations: {
      1: 'Logical Access Node is a fabricated term.',
      2: 'Longitudinal Array Network is not a networking standard.',
      3: 'Linked Address Number is not an industry concept.',
    },
  },
  {
    id: 'cn-add-2',
    subject: 'computer-networks',
    standard: 'Intermediate',
    difficulty: 'medium',
    question: 'Which networking device operates primarily at OSI Layer 2 to forward frames based on hardware MAC addresses?',
    options: ['Network Switch', 'Network Router', 'Application Firewall', 'Repeater / Hub'],
    correctIndex: 0,
    explanation: 'A Layer 2 Switch inspects destination MAC addresses in Ethernet frames and uses its CAM table to forward data frames directly to the appropriate physical port.',
    wrongExplanations: {
      1: 'Routers operate at Layer 3 (Network Layer) using IP addresses.',
      2: 'Application firewalls operate at Layers 4–7.',
      3: 'Hubs and repeaters operate at Layer 1 (Physical Layer), broadcasting electrical signals to all ports.',
    },
  },
  {
    id: 'cn-add-3',
    subject: 'computer-networks',
    standard: 'Advanced',
    difficulty: 'hard',
    question: 'What is the role of the Address Resolution Protocol (ARP)?',
    options: [
      'Resolving a known IPv4 address to its corresponding physical MAC hardware address on a local network',
      'Converting domain names like example.com into IPv4 addresses',
      'Translating private IP addresses to public IPs in NAT routers',
      'Encrypting data packets transferred across IPSec tunnels',
    ],
    correctIndex: 0,
    explanation: 'ARP translates Layer 3 IP addresses to Layer 2 physical MAC addresses on a local broadcast network link so Ethernet frames can be constructed and delivered.',
    wrongExplanations: {
      1: 'Translating domain names to IP addresses is the role of DNS.',
      2: 'Translating private IPs to public IPs is NAT (Network Address Translation).',
      3: 'Packet encryption is handled by IPSec, TLS, or WireGuard.',
    },
  },

  // ----------------------------------------------------
  // 11. AI / ML (Additional)
  // ----------------------------------------------------
  {
    id: 'aiml-add-1',
    subject: 'ai-ml',
    standard: 'Beginner',
    difficulty: 'easy',
    question: 'What is a "Perceptron" in artificial intelligence history?',
    options: [
      'The earliest artificial neuron mathematical model, developed by Frank Rosenblatt in 1957',
      'A robotic vacuum cleaner designed by NASA',
      'An analog optical lens for early computers',
      'A computer virus that replicates in neural networks',
    ],
    correctIndex: 0,
    explanation: 'The Perceptron is the fundamental building block of neural networks: a binary linear classifier that computes a weighted sum of inputs and applies a step function.',
    wrongExplanations: {
      1: 'Robotic vacuums are commercial consumer robots.',
      2: 'Optical lenses are physics optics hardware.',
      3: 'Perceptrons are algorithmic models, not malicious viruses.',
    },
  },
  {
    id: 'aiml-add-2',
    subject: 'ai-ml',
    standard: 'Intermediate',
    difficulty: 'medium',
    question: 'In deep learning, what is "Dropout" used for?',
    options: [
      'A regularization technique where randomly selected neurons are ignored during training to prevent overfitting',
      'A hardware error when cables drop out of server racks',
      'Discarding corrupted images from hard drive storage',
      'Deleting students who drop out of online computer science courses',
    ],
    correctIndex: 0,
    explanation: 'Dropout randomly deactivates a fraction of neurons during forward and backward passes of training, forcing network layers to learn redundant, robust feature representations.',
    wrongExplanations: {
      1: 'Cable disconnections are physical datacenter hardware faults.',
      2: 'Image filtering is data pre-processing.',
      3: 'Student course enrollment relates to academic administration.',
    },
  },
  {
    id: 'aiml-add-3',
    subject: 'ai-ml',
    standard: 'Advanced',
    difficulty: 'hard',
    question: 'What is the "Exploding Gradient" problem in deep neural network training?',
    options: [
      'When gradients accumulate during backpropagation and become extremely large, destabilizing weights and resulting in NaN values',
      'When GPU cooling fans fail under intense heat',
      'When training datasets exceed 100 Petabytes',
      'When learning rates automatically drop to zero',
    ],
    correctIndex: 0,
    explanation: 'Exploding gradients occur when large error gradients multiply through deep layers during backpropagation, causing massive weight updates that overflow floating-point limits (often producing NaN).',
    wrongExplanations: {
      1: 'Cooling fan failures are mechanical hardware issues.',
      2: 'Massive datasets describe big data scale, not mathematical gradient explosion.',
      3: 'Gradients dropping to zero is the opposite problem (vanishing gradients).',
    },
  },

  // ----------------------------------------------------
  // 12. Web Dev (Additional)
  // ----------------------------------------------------
  {
    id: 'web-add-1',
    subject: 'web-dev',
    standard: 'Beginner',
    difficulty: 'easy',
    question: 'What does CSS stand for in web development?',
    options: ['Cascading Style Sheets', 'Computer System Styles', 'Creative Script Syntax', 'Compiled Screen Sheets'],
    correctIndex: 0,
    explanation: 'CSS stands for Cascading Style Sheets, the language used to describe the presentation and layout of documents written in HTML.',
    wrongExplanations: {
      1: 'Computer System Styles is a fabricated term.',
      2: 'Creative Script Syntax is not an industry phrase.',
      3: 'Compiled Screen Sheets is not what CSS stands for.',
    },
  },
  {
    id: 'web-add-2',
    subject: 'web-dev',
    standard: 'Intermediate',
    difficulty: 'medium',
    question: 'What is the purpose of the `localStorage` API in web browsers?',
    options: [
      'Storing key-value data persistently in the browser with no expiration date across sessions',
      'Running SQL queries directly against remote PostgreSQL servers',
      'Downloading movies to the user’s local Documents folder without permission',
      'Encrypting internet traffic between the router and ISP',
    ],
    correctIndex: 0,
    explanation: '`localStorage` provides persistent client-side key-value storage (typically up to 5MB per origin) that remains intact even when browser tabs or the window are closed.',
    wrongExplanations: {
      1: '`localStorage` is a client-side key-value store, not a remote SQL server.',
      2: 'Browsers cannot download files silently without user intent due to security sandboxing.',
      3: 'ISP traffic encryption is handled by TLS/HTTPS, not client storage APIs.',
    },
  },
  {
    id: 'web-add-3',
    subject: 'web-dev',
    standard: 'Advanced',
    difficulty: 'hard',
    question: 'In modern JavaScript, what is the difference between a Microtask (e.g., Promise.then) and a Macrotask (e.g., setTimeout)?',
    options: [
      'Microtasks are executed immediately after the current task finishes and before the event loop yields to rendering or macrotasks',
      'Macrotasks run directly on GPU cores while microtasks run on CPU threads',
      'Microtasks can only execute code containing less than 100 characters',
      'There is no difference; they are synonymous terms in the ECMAScript specification',
    ],
    correctIndex: 0,
    explanation: 'The JavaScript event loop drains the entire Microtask queue at the end of every execution phase before picking up the next Macrotask (such as setTimeout, setInterval, or I/O events).',
    wrongExplanations: {
      1: 'Both microtasks and macrotasks execute within the browser JavaScript runtime on CPU threads.',
      2: 'Task types are independent of code length.',
      3: 'The distinction between microtasks and macrotasks is fundamental to the HTML and event loop specs.',
    },
  },

  // ----------------------------------------------------
  // 13. Cybersecurity (Additional)
  // ----------------------------------------------------
  {
    id: 'sec-add-1',
    subject: 'cybersecurity',
    standard: 'Beginner',
    difficulty: 'easy',
    question: 'What is "Ransomware" in malware classifications?',
    options: [
      'Malware that encrypts a victim’s files and demands payment in exchange for the decryption key',
      'Software that records keystrokes to steal bank passwords',
      'A script that sends promotional spam emails from infected accounts',
      'A utility that tests network cables for copper degradation',
    ],
    correctIndex: 0,
    explanation: 'Ransomware locks or encrypts access to files or the entire operating system, demanding financial ransom (often in cryptocurrency) to unlock the data.',
    wrongExplanations: {
      1: 'Recording keystrokes is the definition of a Keylogger.',
      2: 'Sending spam emails is a Spambot.',
      3: 'Testing cables is a hardware cable diagnostic tool.',
    },
  },
  {
    id: 'sec-add-2',
    subject: 'cybersecurity',
    standard: 'Intermediate',
    difficulty: 'medium',
    question: 'What is a "Man-in-the-Middle" (MitM) attack?',
    options: [
      'An attack where the attacker secretly intercepts and potentially alters communications between two parties who believe they are communicating directly',
      'An attack where an intruder physically cuts undersea internet fiber lines',
      'A hardware attack where an employee steals laptop chargers from an office',
      'An attack that overclocks CPU voltage to burn physical transistors',
    ],
    correctIndex: 0,
    explanation: 'In a MitM attack, the attacker places themselves between the sender and receiver (e.g. via ARP spoofing or rogue Wi-Fi access points) to eavesdrop or modify traffic.',
    wrongExplanations: {
      1: 'Cutting fiber cables is physical infrastructure sabotage.',
      2: 'Stealing equipment is physical workplace theft.',
      3: 'Overclocking attacks are thermal stress attacks.',
    },
  },
  {
    id: 'sec-add-3',
    subject: 'cybersecurity',
    standard: 'Advanced',
    difficulty: 'hard',
    question: 'What is "Cross-Site Request Forgery" (CSRF)?',
    options: [
      'An attack that tricks an authenticated user’s browser into executing unwanted actions on a trusted site where the user is currently logged in',
      'Injecting raw SQL into URL parameters to dump user tables',
      'Cracking Wi-Fi WPA2 passwords using rainbow tables',
      'Flooding DNS root servers with UDP amplification traffic',
    ],
    correctIndex: 0,
    explanation: 'CSRF exploits the trust a web application has in the user\'s browser by sending forged requests that include the victim\'s active session cookies without their knowledge.',
    wrongExplanations: {
      1: 'Dumping database tables via URL parameters is SQL Injection.',
      2: 'Cracking WPA2 handshakes is Wi-Fi password cracking.',
      3: 'Flooding DNS servers is a Distributed Denial of Service (DDoS) attack.',
    },
  },

  // ----------------------------------------------------
  // 14. General CS (Additional)
  // ----------------------------------------------------
  {
    id: 'gcs-add-1',
    subject: 'general-cs',
    standard: 'Beginner',
    difficulty: 'easy',
    question: 'What is the base of the Octal numbering system?',
    options: ['8', '10', '16', '2'],
    correctIndex: 0,
    explanation: 'The Octal numbering system has a base (radix) of 8 and uses digits 0 through 7.',
    wrongExplanations: {
      1: 'Base 10 is Decimal.',
      2: 'Base 16 is Hexadecimal.',
      3: 'Base 2 is Binary.',
    },
  },
  {
    id: 'gcs-add-2',
    subject: 'general-cs',
    standard: 'Intermediate',
    difficulty: 'medium',
    question: 'In computer science, what is an "Algorithm"?',
    options: [
      'A step-by-step, finite sequence of well-defined instructions for solving a specific computational problem',
      'A physical silicon microprocessor designed to multiply matrices',
      'A computer programming language created specifically for quantum computers',
      'An encrypted password stored on a blockchain ledger',
    ],
    correctIndex: 0,
    explanation: 'An algorithm is an unambiguous, finite sequence of computational steps that transforms input into desired output to solve a well-specified problem.',
    wrongExplanations: {
      1: 'Silicon processors are physical hardware hardware chips.',
      2: 'Languages like Q# are programming languages, not the definition of an algorithm.',
      3: 'Encrypted passwords on ledgers are cryptographic hashes.',
    },
  },
  {
    id: 'gcs-add-3',
    subject: 'general-cs',
    standard: 'Advanced',
    difficulty: 'hard',
    question: 'What does the "CAP Theorem" state regarding distributed database systems?',
    options: [
      'A distributed data store can simultaneously provide at most two out of three guarantees: Consistency, Availability, and Partition Tolerance',
      'All relational databases must be certified by Apache Foundation',
      'Data compression cannot exceed 50% without quality loss',
      'Computers cannot execute algorithms faster than the speed of light',
    ],
    correctIndex: 0,
    explanation: 'Formulated by Eric Brewer, the CAP Theorem proves that in the event of a network partition (P), a distributed system must choose between Consistency (C) and Availability (A).',
    wrongExplanations: {
      1: 'The Apache Foundation does not mandate database certification.',
      2: 'Compression bounds depend on Shannon entropy, not a fixed 50% threshold.',
      3: 'Processing speed vs light velocity is relativistic physics, not the CAP Theorem.',
    },
  },
];
