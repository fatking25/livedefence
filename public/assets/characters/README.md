# Character Asset Folders

Place future character sprites here.

Recommended layout:

```text
public/assets/characters/
  kyma/
    idle_down.png
    walk_down.png
    idle_down_right.png
    walk_down_right.png
    idle_right.png
    walk_right.png
    idle_up_right.png
    walk_up_right.png
    idle_up.png
    walk_up.png
  enemies/
    normal_down.png
    charger_down.png
    camera_down.png
    obsessed_down.png
    mid_boss_down.png
    final_boss_down.png
```

For MVP, 4 directions are enough. For a smoother top-view action game, use 8 directions:

- down
- down_right
- right
- up_right
- up
- up_left
- left
- down_left

If the left-facing sprites mirror cleanly, you can provide only 5 directions and mirror the right-side sprites in code later.
