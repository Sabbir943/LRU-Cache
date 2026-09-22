# LRU Cache Implementation (with Optional TTL Support)

An implementation of a **Least Recently Used (LRU) Cache** supporting $O(1)$ average time complexity for both `get()` and `put()` operations, alongside optional **Time-To-Live (TTL)** expiration logic.

---

## Data Structures Used & Why

1. **Hash Map (`Map`):**
   - Enables $O(1)$ average lookup time to verify key existence and locate nodes directly.
2. **Doubly Linked List:**
   - Tracks the dynamic usage order of entries.
   - Allows $O(1)$ insertions at the head (Most Recently Used) and $O(1)$ evictions from the tail (Least Recently Used).
   - In combination with the hash map, moving any accessed node to the head takes $O(1)$ time.

---

## How LRU Ordering is Maintained

- **`get(key)`**: When an existing key is queried, its node is detached from its current position in the linked list and relocated to the front (immediately following the dummy `head`).
- **`put(key, value)`**:
  - **Existing Key**: The node's value is updated and moved to the `head`.
  - **New Key**: A new node is inserted at the `head`. If the cache has reached maximum capacity, the node directly preceding the dummy `tail` is evicted from both the linked list and the map.

---

## Complexity Analysis

| Operation | Time Complexity | Space Complexity |
| --------- | --------------- | ---------------- |
| `get()`   | $O(1)$ average  | $O(1)$           |
| `put()`   | $O(1)$ average  | $O(1)$           |
| **Total** | —               | $O(N)$           |

*where $N$ is the designated capacity of the cache.*

---

## TTL / Expiration Trade-offs & Approach

- **Approach:** Lazy / Passive Expiration. Expiration timestamps (`Date.now() + ttl`) are calculated on insertion. Expiration checks occur dynamically inside `get()` operations.
- **Trade-offs:**
  - **Pros:** Zero background worker overhead; operations stay fully deterministic and $O(1)$.
  - **Cons:** Unread, expired keys remain in memory until capacity limits force eviction.

---

## Execution Instructions

1. Clone or download the repository:
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd <REPOSITORY_FOLDER>