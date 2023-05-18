# Corex-VueUse

Learn from [VueUse](https://github.com/vueuse/vueuse).

## Introduction

Try to implement VueUse functions by yourself and then think:

- Why is my impl different from VueUse's? What are my mistakes?
- Can I just ignore some differences to focus on core logic? What are they work for?
- Is my impl better than VueUse's in some aspects?

Use `.md` files to record these valuable thoughts.

## Quick Start

Here are recommendations about how to start:

1. First of all, clone [VueUse source code](https://github.com/vueuse/vueuse).
2. [Choose a VueUse function](https://vueuse.org/functions.html) that you are interested in.
3. Create the same directory structure for this function as VueUse done.
4. Copy the following items as the specification:
   - `Type Declarations` in the online doc
   - `demo.vue`
   - Tests (end with `.test.ts`)
5. Try to implement this function.
6. You can import `demo.vue` in `example` web project and execute `npm run dev` to see whether it works (VueUse inspects `demo.vue` in VitePress static site, which needs more configurations).
7. Run tests to make sure your impl works right.
8. Compare your impl with VueUse's, correct mistakes and write docs (you can save your original impl in `index.my.ts`).

To focus on the logic, we can ignore some requirements:

- Compatible with Vue2 (lib `vue-demi` works for this purpose)
- Support directive and component use
- Rely on other shared functions (you can make it up later)
