class Node {
  constructor(key, value, ttl = null) {
    this.key = key;
    this.value = value;
    this.expiry = ttl ? Date.now() + ttl : null;
    this.prev = null;
    this.next = null;
  }

  isExpired() {
    return this.expiry !== null && Date.now() > this.expiry;
  }
}

class Cache {
  constructor(capacity) {
    if (capacity <= 0) {
      throw new Error("Capacity must be a positive integer.");
    }
    this.capacity = capacity;
    this.map = new Map(); // Hash map for O(1) lookups

    // Dummy Head and Tail nodes for Doubly Linked List
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // Remove node from its current position in the linked list
  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  // Add node right after head (marks it as Most Recently Used)
  _add(node) {
    node.next = this.head.next;
    node.next.prev = node;
    this.head.next = node;
    node.prev = this.head;
  }

  // Move existing node to the head
  _moveToHead(node) {
    this._remove(node);
    this._add(node);
  }

  // Remove node from the tail (Least Recently Used)
  _popTail() {
    const res = this.tail.prev;
    this._remove(res);
    return res;
  }

  get(key) {
    if (!this.map.has(key)) {
      return -1;
    }

    const node = this.map.get(key);

    // Check TTL expiration
    if (node.isExpired()) {
      this._remove(node);
      this.map.delete(key);
      return -1;
    }

    // Move accessed item to MRU position
    this._moveToHead(node);
    return node.value;
  }

  put(key, value, ttl = null) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      node.expiry = ttl ? Date.now() + ttl : null;
      this._moveToHead(node);
    } else {
      const newNode = new Node(key, value, ttl);

      if (this.map.size >= this.capacity) {
        const tailNode = this._popTail();
        this.map.delete(tailNode.key);
      }

      this.map.set(key, newNode);
      this._add(newNode);
    }
  }
}

// -------------------------------------------------------------
// Demonstration & Example Run
// -------------------------------------------------------------
async function runDemo() {
  console.log("=== Basic LRU Cache Example ===");
  const cache = new Cache(2);

  cache.put("A", 10);
  console.log('cache.put("A", 10)');

  cache.put("B", 20);
  console.log('cache.put("B", 20)');

  console.log('cache.get("A")  ->', cache.get("A")); // Output: 10

  cache.put("C", 30); // Evicts "B" because "A" was recently accessed
  console.log('cache.put("C", 30) [Evicts "B"]');

  console.log('cache.get("B")  ->', cache.get("B")); // Output: -1
  console.log('cache.get("C")  ->', cache.get("C")); // Output: 30
  console.log('cache.get("A")  ->', cache.get("A")); // Output: 10

  console.log("\n=== Optional Bonus: TTL / Expiration Support ===");
  const ttlCache = new Cache(2);

  // Set key "X" with a 1000ms (1 second) TTL
  ttlCache.put("X", 100, 1000);
  console.log('ttlCache.put("X", 100, 1000ms TTL)');
  console.log('Immediate cache.get("X") ->', ttlCache.get("X")); // Output: 100

  console.log("Waiting 1.2 seconds for key 'X' to expire...");
  await new Promise((resolve) => setTimeout(resolve, 1200));

  console.log('cache.get("X") after delay ->', ttlCache.get("X")); // Output: -1
}

runDemo();