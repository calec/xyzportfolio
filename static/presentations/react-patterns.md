---
marp: true
theme: default
paginate: true
---

# React Patterns I Love

### Clean code in a component world

*Cale Corwin — 2024*

---

## Why Patterns Matter

- Code is read far more than it's written
- Patterns make intent obvious
- Good patterns scale; bad ones collapse

---

## Compound Components

Group related components under one namespace for clean APIs.

```jsx
<Tabs>
  <Tabs.List>
    <Tabs.Tab>One</Tabs.Tab>
    <Tabs.Tab>Two</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel>Content A</Tabs.Panel>
  <Tabs.Panel>Content B</Tabs.Panel>
</Tabs>
```

Shared state lives in context — consumers stay clean.

---

## Custom Hooks

Extract stateful logic into reusable hooks.

```tsx
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initial
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue] as const
}
```

Logic moves out. Components stay dumb and happy.

---

## Render Props (Still Useful)

```tsx
<DataFetcher url="/api/posts">
  {({ data, loading, error }) => (
    loading ? <Spinner /> :
    error   ? <Error msg={error} /> :
              <PostList posts={data} />
  )}
</DataFetcher>
```

Great for cases where hooks don't quite cut it.

---

## The Rule I Live By

> Keep components small, hooks focused, and state as local as possible.

- If a component is hard to name — it's doing too much
- If a hook has 3+ concerns — split it
- If prop drilling goes 3+ levels — reach for context

---

## Thanks

These patterns have saved me hours of refactoring.

Questions? Find me at **cale.xyz**
