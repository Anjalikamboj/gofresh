{
  "brand": {
    "product_name": "KhetiSe",
    "positioning": "Farm-to-home fresh subscriptions with real-time inventory visibility",
    "brand_attributes": [
      "fresh",
      "trustworthy",
      "calmly energetic",
      "local",
      "efficient"
    ],
    "visual_personality": {
      "style_fusion": [
        "Swiss-style clarity (strong grid + typography hierarchy)",
        "Bento grid product browsing (modern ecommerce)",
        "Soft organic tactility (subtle grain + rounded surfaces)",
        "Light glass accents (only for small decorative overlays, not content)"
      ],
      "do_not": [
        "Do not use purple for AI-like vibes (not relevant here)",
        "Do not use heavy gradients across reading areas",
        "Do not center-align the whole app container"
      ]
    }
  },

  "design_tokens": {
    "fonts": {
      "google_fonts_import": "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Figtree:wght@400;500;600;700&display=swap');",
      "font_family_sans": "Figtree, ui-sans-serif, system-ui",
      "font_family_display": "Space Grotesk, ui-sans-serif, system-ui",
      "usage": {
        "headings": "Space Grotesk",
        "body": "Figtree",
        "numbers_tables": "Figtree (tabular-nums via Tailwind 'tabular-nums')"
      }
    },

    "typography_scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight",
      "h2": "text-base md:text-lg font-medium text-muted-foreground",
      "h3_section": "text-xl sm:text-2xl font-semibold tracking-tight",
      "body": "text-sm sm:text-base leading-relaxed",
      "small": "text-xs sm:text-sm text-muted-foreground",
      "ui_label": "text-xs font-medium uppercase tracking-wide"
    },

    "color_system_hsl": {
      "note": "Replace current shadcn defaults in /frontend/src/index.css :root with these HSL tokens. Keep dark mode optional; default experience should be light + fresh.",
      "light": {
        "background": "48 33% 97%",
        "foreground": "160 18% 12%",
        "card": "0 0% 100%",
        "card-foreground": "160 18% 12%",
        "popover": "0 0% 100%",
        "popover-foreground": "160 18% 12%",

        "primary": "158 55% 28%",
        "primary-foreground": "0 0% 98%",

        "secondary": "150 25% 92%",
        "secondary-foreground": "160 18% 12%",

        "muted": "48 20% 93%",
        "muted-foreground": "160 10% 35%",

        "accent": "34 85% 88%",
        "accent-foreground": "160 18% 12%",

        "destructive": "0 72% 52%",
        "destructive-foreground": "0 0% 98%",

        "border": "150 18% 86%",
        "input": "150 18% 86%",
        "ring": "158 55% 28%",

        "success": "142 55% 34%",
        "warning": "38 92% 50%",
        "info": "199 78% 42%",

        "stock_in": "142 55% 34%",
        "stock_low": "38 92% 50%",
        "stock_out": "0 72% 52%",

        "radius": "0.9rem"
      },
      "dark_optional": {
        "background": "160 18% 8%",
        "foreground": "48 33% 97%",
        "card": "160 18% 10%",
        "card-foreground": "48 33% 97%",
        "primary": "150 55% 55%",
        "primary-foreground": "160 18% 10%",
        "border": "160 12% 18%",
        "ring": "150 55% 55%"
      }
    },

    "gradients_and_texture": {
      "restriction": {
        "max_viewport_coverage": "20%",
        "prohibited_examples": [
          "from-blue-500 to-purple-600",
          "from-purple-500 to-pink-500",
          "from-green-500 to-blue-500",
          "from-red-500 to-pink-500"
        ]
      },
      "allowed_gradients": {
        "hero_background_only": [
          "bg-[radial-gradient(1200px_circle_at_20%_10%,hsl(150_55%_92%)_0%,transparent_55%),radial-gradient(900px_circle_at_80%_0%,hsl(34_85%_88%)_0%,transparent_50%)]",
          "bg-[linear-gradient(135deg,hsl(48_33%_97%)_0%,hsl(150_25%_92%)_55%,hsl(48_33%_97%)_100%)]"
        ],
        "decorative_overlay": [
          "bg-[radial-gradient(600px_circle_at_50%_50%,rgba(16,185,129,0.12)_0%,transparent_60%)]"
        ]
      },
      "noise_overlay_css": "/* Add once in index.css */\n.noise-overlay{position:relative;}\n.noise-overlay:before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.06;background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E');mix-blend-mode:multiply;}"
    },

    "spacing_and_layout": {
      "container": "max-w-6xl mx-auto px-4 sm:px-6",
      "section_padding": "py-10 sm:py-14",
      "bento_grid": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4",
      "card_radius": "rounded-2xl",
      "shadow": {
        "card": "shadow-[0_1px_0_rgba(16,24,40,0.04),0_12px_30px_rgba(16,24,40,0.08)]",
        "hover": "hover:shadow-[0_1px_0_rgba(16,24,40,0.06),0_18px_40px_rgba(16,24,40,0.12)]"
      }
    },

    "motion": {
      "library": "framer-motion (recommended)",
      "principles": [
        "Use entrance motion for sections/cards (fade + small y translate)",
        "Use hover lift for product cards (translate-y-0.5) without global transitions",
        "Use progress/step transitions in subscription wizard",
        "Respect prefers-reduced-motion"
      ],
      "tailwind_recipes": {
        "interactive": "transition-colors duration-200",
        "card_hover": "transition-shadow duration-200",
        "press": "active:scale-[0.98]"
      }
    },

    "accessibility": {
      "contrast": "Meet WCAG AA for text on backgrounds; avoid light green text on white.",
      "focus": "Always visible focus ring: focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "keyboard": "All dialogs, menus, tables must be keyboard navigable (shadcn defaults help).",
      "status_text": "Never rely on color alone for stock/order status; include label + icon."
    }
  },

  "component_path": {
    "primary_shadcn_components": [
      "/app/frontend/src/components/ui/button.jsx",
      "/app/frontend/src/components/ui/badge.jsx",
      "/app/frontend/src/components/ui/card.jsx",
      "/app/frontend/src/components/ui/input.jsx",
      "/app/frontend/src/components/ui/select.jsx",
      "/app/frontend/src/components/ui/tabs.jsx",
      "/app/frontend/src/components/ui/table.jsx",
      "/app/frontend/src/components/ui/dialog.jsx",
      "/app/frontend/src/components/ui/drawer.jsx",
      "/app/frontend/src/components/ui/sheet.jsx",
      "/app/frontend/src/components/ui/tooltip.jsx",
      "/app/frontend/src/components/ui/popover.jsx",
      "/app/frontend/src/components/ui/calendar.jsx",
      "/app/frontend/src/components/ui/progress.jsx",
      "/app/frontend/src/components/ui/separator.jsx",
      "/app/frontend/src/components/ui/sonner.jsx",
      "/app/frontend/src/components/ui/skeleton.jsx",
      "/app/frontend/src/components/ui/switch.jsx",
      "/app/frontend/src/components/ui/dropdown-menu.jsx",
      "/app/frontend/src/components/ui/navigation-menu.jsx",
      "/app/frontend/src/components/ui/pagination.jsx"
    ],
    "icons": {
      "library": "lucide-react",
      "common": [
        "Leaf",
        "Truck",
        "Calendar",
        "PauseCircle",
        "PlayCircle",
        "PackageCheck",
        "AlertTriangle",
        "Search",
        "SlidersHorizontal",
        "Pencil",
        "Save",
        "X"
      ]
    }
  },

  "page_blueprints": {
    "global_shell": {
      "top_nav": {
        "layout": "Left: KhetiSe wordmark + Leaf icon; Center (desktop): Products / Subscriptions / Orders / Admin; Right: Search + Cart placeholder (future) + Profile",
        "component": "navigation-menu + input (search) + dropdown-menu (profile)",
        "mobile": "Use sheet/drawer for nav; keep search as icon opening a dialog",
        "data_testids": {
          "nav": "top-nav",
          "nav-products": "nav-products-link",
          "nav-subscriptions": "nav-subscriptions-link",
          "nav-orders": "nav-orders-link",
          "nav-admin": "nav-admin-link",
          "nav-search": "nav-search-button",
          "nav-profile": "nav-profile-menu"
        }
      },
      "footer": {
        "style": "Minimal, no gradients. Use muted background and small type.",
        "content": "Farm partners, delivery zones, support email"
      }
    },

    "home_products": {
      "hero": {
        "layout": "Two-column on lg: left copy + CTA, right bento highlight cards (Seasonal Box, Next Delivery Slots, Low-stock alerts). Mobile: stacked.",
        "background": "Use allowed hero background gradient (max 20% viewport) + noise overlay.",
        "primary_cta": "Create subscription",
        "secondary_cta": "Browse products",
        "data_testids": {
          "hero": "products-hero",
          "hero-primary-cta": "hero-create-subscription-button",
          "hero-secondary-cta": "hero-browse-products-button"
        }
      },
      "product_browse": {
        "layout": "Bento grid product cards with quick add-to-subscription (not cart).",
        "filters": "Sticky filter row: category select, dietary tags, sort, in-stock toggle.",
        "inventory_display": {
          "pattern": "Badge + thin progress bar",
          "rules": {
            "in_stock": ">= 20 units",
            "low_stock": "1-19 units",
            "out_of_stock": "0 units"
          },
          "badge_copy": {
            "in": "In stock",
            "low": "Low",
            "out": "Out"
          }
        },
        "components": [
          "card",
          "badge",
          "button",
          "progress",
          "skeleton",
          "tooltip"
        ],
        "data_testids": {
          "filters": "product-filters",
          "search": "product-search-input",
          "category": "product-category-select",
          "in-stock-toggle": "product-in-stock-toggle",
          "grid": "product-grid",
          "card": "product-card",
          "card-add": "product-add-to-subscription-button",
          "stock-badge": "product-stock-badge"
        }
      }
    },

    "create_subscription": {
      "flow": {
        "pattern": "3-step wizard in a card: (1) Select products (2) Frequency & delivery day (3) Confirm",
        "components": [
          "tabs OR custom stepper",
          "progress",
          "card",
          "table (selected items)",
          "calendar (delivery start date)",
          "select",
          "dialog (edit item quantity)"
        ],
        "micro_interactions": [
          "Step transition: fade + slide 8px",
          "When adding item: toast via sonner + subtle highlight ring on selected list",
          "Disable Next until requirements met; show helper text"
        ],
        "data_testids": {
          "wizard": "subscription-wizard",
          "step-products": "subscription-step-products",
          "step-frequency": "subscription-step-frequency",
          "step-confirm": "subscription-step-confirm",
          "next": "subscription-next-button",
          "back": "subscription-back-button",
          "confirm": "subscription-confirm-button",
          "frequency": "subscription-frequency-select",
          "delivery-day": "subscription-delivery-day-select",
          "start-date": "subscription-start-date-calendar"
        }
      }
    },

    "my_subscriptions": {
      "layout": "List of subscription cards; each card shows next delivery date, frequency, items count, and status.",
      "controls": {
        "pause_resume": "Use switch for quick toggle + confirm alert-dialog for pausing (avoid accidental).",
        "status_badges": "Active (green), Paused (muted), Needs attention (warning if low-stock items in next delivery)."
      },
      "components": [
        "card",
        "badge",
        "switch",
        "alert-dialog",
        "calendar (view schedule)",
        "drawer (mobile details)"
      ],
      "data_testids": {
        "list": "subscriptions-list",
        "card": "subscription-card",
        "pause": "subscription-pause-button",
        "resume": "subscription-resume-button",
        "toggle": "subscription-status-switch",
        "next-delivery": "subscription-next-delivery-text"
      }
    },

    "orders": {
      "layout": "Tabs: Upcoming / Past. Each order row shows delivery date, status, and items summary.",
      "status_system": {
        "created": "Badge variant=secondary + icon Package",
        "blocked": "Badge variant=outline + icon AlertTriangle + helper text explaining inventory issue",
        "delivered": "Badge variant=default (primary) + icon PackageCheck"
      },
      "components": [
        "tabs",
        "table",
        "badge",
        "dialog (order details)",
        "pagination"
      ],
      "data_testids": {
        "tabs": "orders-tabs",
        "table": "orders-table",
        "row": "order-row",
        "status": "order-status-badge",
        "details": "order-details-button"
      }
    },

    "admin_dashboard": {
      "layout": "Two-pane: top KPI cards (Total SKUs, Low stock, Out of stock) + main inline-edit inventory table.",
      "table_pattern": {
        "reference": "shadcn inline-edit table blocks (pattern only; implement with existing shadcn table + input)",
        "features": [
          "Search",
          "Category filter",
          "Sort by stock",
          "Inline edit stock cell (pencil on hover)",
          "Row action menu (dropdown-menu): Edit, Mark out-of-stock, Archive (future)",
          "Optimistic UI + toast on save"
        ]
      },
      "components": [
        "card",
        "table",
        "input",
        "select",
        "dropdown-menu",
        "badge",
        "dialog",
        "sonner"
      ],
      "data_testids": {
        "kpis": "admin-kpi-cards",
        "table": "admin-inventory-table",
        "search": "admin-inventory-search-input",
        "row": "admin-inventory-row",
        "edit-stock": "admin-edit-stock-button",
        "stock-input": "admin-stock-input",
        "save": "admin-save-stock-button"
      }
    }
  },

  "component_specs": {
    "buttons": {
      "shape": "Rounded (8–12px) with calm, premium grocery feel",
      "variants": {
        "primary": {
          "use": "Main CTAs (Create subscription, Confirm)",
          "classes": "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 active:scale-[0.98]",
          "focus": "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        },
        "secondary": {
          "use": "Browse, Back, neutral actions",
          "classes": "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200"
        },
        "ghost": {
          "use": "Inline actions in tables/cards",
          "classes": "hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
        },
        "destructive": {
          "use": "Pause subscription confirm, admin mark out-of-stock",
          "classes": "bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors duration-200"
        }
      },
      "sizes": {
        "sm": "h-9 px-3 text-sm",
        "md": "h-10 px-4 text-sm",
        "lg": "h-11 px-5 text-base"
      }
    },

    "badges": {
      "inventory": {
        "in_stock": "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border border-[hsl(var(--success))]/25",
        "low_stock": "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))] border border-[hsl(var(--warning))]/25",
        "out_of_stock": "bg-[hsl(var(--destructive))]/12 text-[hsl(var(--destructive))] border border-[hsl(var(--destructive))]/25"
      },
      "order_status": {
        "created": "bg-secondary text-secondary-foreground",
        "blocked": "bg-[hsl(var(--warning))]/15 text-[hsl(var(--foreground))] border border-[hsl(var(--warning))]/25",
        "delivered": "bg-primary text-primary-foreground"
      }
    },

    "cards": {
      "base": "rounded-2xl bg-card text-card-foreground border border-border shadow-[0_1px_0_rgba(16,24,40,0.04),0_12px_30px_rgba(16,24,40,0.08)]",
      "product_card": {
        "layout": "Image area (aspect-ratio) + title/price + stock badge + quick add",
        "hover": "hover:shadow-[0_1px_0_rgba(16,24,40,0.06),0_18px_40px_rgba(16,24,40,0.12)] transition-shadow duration-200",
        "image": "Use aspect-ratio component; fallback to gradient placeholder if no images"
      }
    },

    "forms": {
      "inputs": "Use shadcn input/select; add helper text below for constraints.",
      "validation": "Inline error text in destructive color + aria-describedby; toast only for global errors.",
      "data_testids_rule": "Every input/select/button must include data-testid in kebab-case."
    },

    "tables_admin": {
      "density": "Comfortable rows (py-3) with sticky header on scroll-area.",
      "inline_edit": {
        "pattern": "Cell shows value + pencil icon on hover; click turns into input with Save/X buttons.",
        "keyboard": "Enter saves, Escape cancels.",
        "loading": "Show small spinner in cell while saving; disable row actions."
      }
    }
  },

  "libraries": {
    "recommended": [
      {
        "name": "framer-motion",
        "why": "Micro-interactions + step transitions + list animations",
        "install": "npm i framer-motion",
        "usage_snippet_js": "import { motion } from 'framer-motion';\n\nexport default function Section({ children }) {\n  return (\n    <motion.section\n      initial={{ opacity: 0, y: 8 }}\n      whileInView={{ opacity: 1, y: 0 }}\n      viewport={{ once: true, margin: '-80px' }}\n      transition={{ duration: 0.35, ease: 'easeOut' }}\n    >\n      {children}\n    </motion.section>\n  );\n}"
      },
      {
        "name": "recharts",
        "why": "Admin KPI mini charts (stock trend, low-stock count over time)",
        "install": "npm i recharts",
        "usage_snippet_js": "import { LineChart, Line, ResponsiveContainer } from 'recharts';"
      }
    ],
    "avoid": [
      "Do not add heavy 3D libraries; not needed for grocery subscription UX"
    ]
  },

  "image_urls": {
    "note": "Image selector tool failed in this environment. Use these safe placeholders now; swap later with real farm photography.",
    "hero": [
      {
        "category": "hero",
        "description": "Fresh produce flat lay (placeholder)",
        "url": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80"
      }
    ],
    "product_cards": [
      {
        "category": "product",
        "description": "Tomatoes close-up (placeholder)",
        "url": "https://images.unsplash.com/photo-1546470427-227c7f0f1f0b?auto=format&fit=crop&w=1200&q=80"
      },
      {
        "category": "product",
        "description": "Leafy greens (placeholder)",
        "url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "empty_states": [
      {
        "category": "empty-state",
        "description": "Simple illustrated basket SVG (create in-app)",
        "url": "inline-svg://basket-outline"
      }
    ]
  },

  "instructions_to_main_agent": {
    "css_updates": [
      "Replace /app/frontend/src/App.css CRA defaults; keep it minimal (no centered layout).",
      "In /app/frontend/src/index.css: add Google Fonts import at top; update :root HSL tokens to the palette above; add .noise-overlay utility.",
      "Add Tailwind utility classes in components; avoid writing lots of bespoke CSS."
    ],
    "layout_rules": [
      "Mobile-first: single column; introduce bento grid at sm/lg.",
      "Use generous whitespace: section padding py-10+.",
      "Use badges + labels for stock/order statuses; never color-only."
    ],
    "testing_rules": [
      "Add data-testid to: nav links, CTAs, filters, product cards, wizard steps, pause/resume controls, order rows, admin table inputs/buttons.",
      "Use kebab-case describing role (not appearance)."
    ],
    "inventory_ui": [
      "Show stock count + badge + progress bar on product cards.",
      "Admin: inline edit stock with optimistic save + sonner toast."
    ]
  },

  "appendix_general_ui_ux_design_guidelines": "<General UI UX Design Guidelines>  \n    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.\n</General UI UX Design Guidelines>"
}
