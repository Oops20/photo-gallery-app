# Photo Gallery App

## Current State
New project with no existing frontend implementation.

## Requested Changes (Diff)

### Add
- `useFetchPhotos` custom hook: fetches 30 photos from `https://picsum.photos/v2/list?limit=30`, returns `{ photos, loading, error }`
- Loading spinner shown while fetching
- Error message shown on fetch failure
- Responsive photo grid: 4 cols desktop, 2 cols tablet, 1 col mobile
- Photo card: image, author name, heart icon favourite button
- Search input at top, filters photos by author name in real-time using `useCallback` + `useMemo`
- Favourites toggle via heart icon, managed with `useReducer`, persisted to `localStorage`

### Modify
- None

### Remove
- None

## Implementation Plan
1. Create `useFetchPhotos` hook in `src/hooks/useFetchPhotos.ts`
2. Create `favouritesReducer` and initial state loaded from `localStorage`
3. Build `App.tsx` with: useFetchPhotos, useReducer for favourites, useCallback for search handler, useMemo for filtered list
4. Build `PhotoCard` component: image, author name, heart toggle button
5. Wire loading/error states to spinner and error message UI
6. All styling via Tailwind CSS only
