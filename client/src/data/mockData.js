/**
 * StudyAI Mock & Seed Data
 * Provides realistic starter content for Operating Systems, Java Collections, DBMS, and Computer Networks
 */

export const INITIAL_STATS = {
  topicsStudied: 12,
  flashcardsReviewed: 248,
  quizzesCompleted: 34,
  averageScore: 86
};

export const INITIAL_TOPICS = [
  {
    id: 'os-process',
    title: 'Operating Systems',
    subtitle: 'Process Management & Synchronization',
    icon: 'Cpu',
    category: 'Computer Science',
    progress: 68,
    lastStudied: '2 hours ago',
    cardsCount: 10,
    quizScore: 85,
    difficulty: 'medium',
    summary: 'Covers CPU scheduling algorithms (Round Robin, FCFS, Priority), process control blocks (PCB), IPC mechanisms (pipes, message queues, shared memory), and synchronization primitives (mutexes, semaphores, monitors).',
    concepts: ['Process Control Block', 'Context Switching', 'Round Robin', 'Deadlock Detection', 'Binary Semaphore', 'Virtual Memory'],
    cards: [
      { id: 1, front: 'What is a Process Control Block (PCB)?', back: 'A data structure maintained by the OS containing all information about a process (PID, CPU registers, program counter, memory limits, and open files).' },
      { id: 2, front: 'What is the critical difference between a Process and a Thread?', back: 'A process is an independent execution unit with its own address space, whereas threads share the same address space and resources of their parent process.' },
      { id: 3, front: 'What are the 4 Coffman conditions for Deadlock?', back: '1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait.' },
      { id: 4, front: 'How does the Round Robin scheduling algorithm work?', back: 'Each process is assigned a fixed time slice (quantum) in a circular queue. If it does not complete within the quantum, it is preempted and put at the back.' },
      { id: 5, front: 'What is Context Switching?', back: 'The procedure of saving the current CPU state of an active process and loading the saved state of another process to resume execution.' }
    ],
    questions: [
      {
        id: 1,
        question: 'Which of the following scheduling algorithms can cause starvation for low-priority processes?',
        topic: 'Process Scheduling',
        options: ['Priority Scheduling', 'Round Robin', 'First-Come, First-Served', 'Shortest Remaining Time First with Aging'],
        correctAnswer: 0,
        explanation: 'In pure Priority Scheduling, low priority processes may wait indefinitely if higher priority processes continuously arrive.'
      },
      {
        id: 2,
        question: 'What happens when a process enters a Deadlock state?',
        topic: 'Deadlock & Concurrency',
        options: ['It uses 100% CPU in an infinite loop', 'It is blocked waiting for an event that only another blocked process can trigger', 'It crashes immediately and frees memory', 'It gets demoted to background priority'],
        correctAnswer: 1,
        explanation: 'Deadlock is a state where two or more processes are permanently blocked because each is holding a resource and waiting for another held resource.'
      },
      {
        id: 3,
        question: 'Which IPC mechanism provides the fastest data transfer between processes on the same machine?',
        topic: 'Inter-Process Communication',
        options: ['Shared Memory', 'Unix Domain Sockets', 'Named Pipes (FIFO)', 'Message Queues'],
        correctAnswer: 0,
        explanation: 'Shared Memory is the fastest because once mapped into virtual memory, communication occurs without kernel system call overhead.'
      },
      {
        id: 4,
        question: 'What is the role of a Counting Semaphore?',
        topic: 'Process Synchronization',
        options: ['To serialize binary true/false flags', 'To control access to a resource pool with a finite number of identical instances', 'To allocate CPU cache memory', 'To track overall disk storage usage'],
        correctAnswer: 1,
        explanation: 'A Counting Semaphore has an integer value representing available resource units and can coordinate multiple concurrent accessors.'
      }
    ]
  },
  {
    id: 'java-collections',
    title: 'Java Collections',
    subtitle: 'List, Set, Map & Complexity',
    icon: 'Code2',
    category: 'Programming',
    progress: 82,
    lastStudied: 'Yesterday',
    cardsCount: 12,
    quizScore: 92,
    difficulty: 'medium',
    summary: 'Deep dive into the Java Collections Framework hierarchy, including ArrayList vs LinkedList tradeoffs, HashSet buckets, ConcurrentHashMap lock striping, and fail-fast vs fail-safe iterators.',
    concepts: ['ArrayList', 'LinkedList', 'HashMap Buckets', 'ConcurrentHashMap', 'TreeSet (Red-Black)', 'Fail-Fast Iterators'],
    cards: [
      { id: 1, front: 'Why does ArrayList have O(1) random access while LinkedList has O(n)?', back: 'ArrayList uses a contiguous memory array enabling direct memory offset calculation; LinkedList requires traversing pointers node by node.' },
      { id: 2, front: 'How does HashMap resolve collisions in Java 8+?', back: 'It uses separate chaining with linked lists. If a bucket reaches 8 elements and the table size >= 64, the linked list is treeified into a Red-Black Tree (O(log n)).' },
      { id: 3, front: 'What is the contract between equals() and hashCode()?', back: 'If two objects are equal according to equals(), they MUST have the same hashCode(). If hashCodes are equal, objects are NOT necessarily equal.' }
    ],
    questions: [
      {
        id: 1,
        question: 'What happens when you add an element to an ArrayList that has reached its internal capacity?',
        topic: 'Dynamic Arrays',
        options: ['It throws an IndexOutOfBoundsException', 'A new array of 1.5x capacity is allocated and elements are copied over', 'A linked list chain is appended to the end', 'The oldest element is automatically dropped'],
        correctAnswer: 1,
        explanation: 'Java ArrayList creates a new array with oldCapacity + (oldCapacity >> 1) (~1.5x) and copies elements over.'
      },
      {
        id: 2,
        question: 'Which Map implementation guarantees that keys are iterated in insertion order?',
        topic: 'Map Implementations',
        options: ['HashMap', 'TreeMap', 'LinkedHashMap', 'Hashtable'],
        correctAnswer: 2,
        explanation: 'LinkedHashMap maintains a doubly-linked list running through all its entries, preserving insertion order.'
      }
    ]
  },
  {
    id: 'dbms-core',
    title: 'DBMS & SQL',
    subtitle: 'ACID, Normalization & Indexing',
    icon: 'Database',
    category: 'Databases',
    progress: 54,
    lastStudied: '3 days ago',
    cardsCount: 8,
    quizScore: 78,
    difficulty: 'hard',
    summary: 'Comprehensive analysis of Relational Database Management Systems: B+ Tree indexing, ACID transactions, isolation levels, foreign key cascades, and 1NF to BCNF normalization.',
    concepts: ['ACID Properties', 'B+ Tree Indexing', 'Isolation Levels', '3NF & BCNF', 'Write-Ahead Logging (WAL)', 'Clustered Index'],
    cards: [
      { id: 1, front: 'What is the difference between Clustered and Non-Clustered Index?', back: 'A Clustered index dictates the physical order of data on disk (only 1 per table); a Non-Clustered index stores key values and pointers to data rows.' },
      { id: 2, front: 'What are the 4 standard SQL Transaction Isolation Levels?', back: '1. Read Uncommitted, 2. Read Committed, 3. Repeatable Read, 4. Serializable.' }
    ],
    questions: [
      {
        id: 1,
        question: 'Which anomaly is prevented by the "Repeatable Read" isolation level but permitted in "Read Committed"?',
        topic: 'Transactions & ACID',
        options: ['Dirty Reads', 'Non-Repeatable (Fuzzy) Reads', 'Phantom Reads', 'Lost Updates only'],
        correctAnswer: 1,
        explanation: 'Repeatable Read ensures that data read during a transaction will not be changed by other committed transactions during that session.'
      }
    ]
  },
  {
    id: 'computer-networks',
    title: 'Computer Networks',
    subtitle: 'OSI Model, TCP/IP & Protocols',
    icon: 'Network',
    category: 'Computer Science',
    progress: 90,
    lastStudied: '4 days ago',
    cardsCount: 14,
    quizScore: 94,
    difficulty: 'easy',
    summary: 'Explores the 7-layer OSI model, 4-layer TCP/IP stack, 3-way handshake, TCP flow and congestion control, UDP datagrams, DNS resolution, and HTTP/HTTPS security.',
    concepts: ['OSI 7 Layers', 'TCP 3-Way Handshake', 'DNS Hierarchy', 'Sliding Window Protocol', 'TLS / SSL Handshake', 'CIDR Subnetting'],
    cards: [
      { id: 1, front: 'Describe the TCP 3-way handshake sequence.', back: '1. Client sends SYN. 2. Server responds with SYN-ACK. 3. Client sends ACK. The reliable connection is established.' },
      { id: 2, front: 'Why does UDP have lower latency than TCP?', back: 'UDP is connectionless and does not perform handshakes, packet acknowledgment, retransmissions, or ordering checks.' }
    ],
    questions: [
      {
        id: 1,
        question: 'At which OSI layer does the Router primarily operate?',
        topic: 'OSI Architecture',
        options: ['Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 7 (Application)'],
        correctAnswer: 1,
        explanation: 'Routers operate at the Network Layer (Layer 3) to route IP packets across interconnected networks.'
      }
    ]
  }
];

export const INITIAL_MISTAKES = [
  {
    id: 'm1',
    topicId: 'os-process',
    topicName: 'Operating Systems',
    subtopic: 'Deadlock & Concurrency',
    difficulty: 'medium',
    question: 'What happens when a process enters a Deadlock state?',
    yourAnswer: 'It crashes immediately and frees memory',
    correctAnswer: 'It is blocked waiting for an event that only another blocked process can trigger',
    explanation: 'Deadlock is a state where two or more processes are permanently blocked because each is holding a resource and waiting for another held resource.',
    options: [
      'It uses 100% CPU in an infinite loop',
      'It is blocked waiting for an event that only another blocked process can trigger',
      'It crashes immediately and frees memory',
      'It gets demoted to background priority'
    ],
    correctAnswerIndex: 1
  },
  {
    id: 'm2',
    topicId: 'dbms-core',
    topicName: 'DBMS & SQL',
    subtopic: 'Transactions & ACID',
    difficulty: 'hard',
    question: 'Which anomaly is prevented by the "Repeatable Read" isolation level but permitted in "Read Committed"?',
    yourAnswer: 'Dirty Reads',
    correctAnswer: 'Non-Repeatable (Fuzzy) Reads',
    explanation: 'Repeatable Read ensures that data read during a transaction will not be changed by other committed transactions during that session.',
    options: [
      'Dirty Reads',
      'Non-Repeatable (Fuzzy) Reads',
      'Phantom Reads',
      'Lost Updates only'
    ],
    correctAnswerIndex: 1
  },
  {
    id: 'm3',
    topicId: 'os-process',
    topicName: 'Operating Systems',
    subtopic: 'Process Scheduling',
    difficulty: 'medium',
    question: 'Which of the following scheduling algorithms can cause starvation for low-priority processes?',
    yourAnswer: 'Round Robin',
    correctAnswer: 'Priority Scheduling',
    explanation: 'In pure Priority Scheduling, low priority processes may wait indefinitely if higher priority processes continuously arrive.',
    options: [
      'Priority Scheduling',
      'Round Robin',
      'First-Come, First-Served',
      'Shortest Remaining Time First with Aging'
    ],
    correctAnswerIndex: 0
  }
];

export const WEEKLY_ACTIVITY = [
  { day: 'Mon', hours: 2.4, count: 28 },
  { day: 'Tue', hours: 3.1, count: 42 },
  { day: 'Wed', hours: 1.8, count: 20 },
  { day: 'Thu', hours: 4.0, count: 55 },
  { day: 'Fri', hours: 2.9, count: 36 },
  { day: 'Sat', hours: 5.2, count: 68 },
  { day: 'Sun', hours: 3.5, count: 48 }
];
