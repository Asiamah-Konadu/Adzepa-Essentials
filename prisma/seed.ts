import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// NOTE: Names, prices and descriptions below are realistic placeholder content
// based on the actual product photography supplied. Replace copy and pricing
// with real figures before going live — see README "Content to replace".

async function main() {
  console.log("Seeding Adzepa Essentials catalog...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const bombers = await prisma.category.create({
    data: {
      name: "Bomber Jackets",
      slug: "bombers",
      description:
        "Statement bomber jackets cut from authentic African wax print, built for everyday wear.",
      position: 0,
    },
  });

  const fabric = await prisma.category.create({
    data: {
      name: "Wax Print Fabric",
      slug: "fabric",
      description:
        "Premium wax print cloth sold by the piece, for anyone who wants to make their own.",
      position: 1,
    },
  });

  const adultSizes = ["S", "M", "L", "XL", "XXL"];

  const bomberProducts = [
    {
      name: "Aduna Red Block Bomber",
      slug: "aduna-red-block-bomber",
      description:
        "Bold red, black and grey geometric block print on a classic bomber silhouette. Ribbed collar, cuffs and hem, full front zip. Cut from heavyweight cotton wax print and lined for structure.",
      fabric: "100% cotton wax print, poly-blend lining",
      priceMinor: 55000,
      compareAtMinor: 65000,
      featured: true,
      image: "bomber-red-block-mannequin.webp",
    },
    {
      name: "Mmere Teal Tribal Bomber",
      slug: "mmere-teal-tribal-bomber",
      description:
        "Teal and black tribal-diamond print with a chunky border motif. A quieter colourway that still holds its own — pairs easily with denim or black joggers.",
      fabric: "100% cotton wax print, poly-blend lining",
      priceMinor: 55000,
      featured: true,
      image: "bomber-teal-tribal-mannequin.webp",
    },
    {
      name: "Adepa Pink Block Bomber",
      slug: "adepa-pink-block-bomber",
      description:
        "The boldest colourway in the line-up: hot pink and black interlocking block print. For customers who want to be seen.",
      fabric: "100% cotton wax print, poly-blend lining",
      priceMinor: 55000,
      featured: false,
      image: "bomber-pink-block-mannequin.webp",
    },
    {
      name: "Sikaman Mustard Geo Bomber",
      slug: "sikaman-mustard-geo-bomber",
      description:
        "Mustard and black geometric print with a warmer, earthier feel. Sits well on both light and dark skin tones — one of our best-selling colourways.",
      fabric: "100% cotton wax print, poly-blend lining",
      priceMinor: 55000,
      featured: false,
      image: "bomber-mustard-geo-mannequin.webp",
    },
    {
      name: "Serwaa Cream Block Bomber",
      slug: "serwaa-cream-block-bomber",
      description:
        "Cream, yellow and black block print — the lightest colourway we carry, built for daytime and warmer weather.",
      fabric: "100% cotton wax print, poly-blend lining",
      priceMinor: 55000,
      featured: false,
      image: "bomber-cream-block-mannequin.webp",
    },
    {
      name: "Obaa Purple Tribal Bomber",
      slug: "obaa-purple-tribal-bomber",
      description:
        "Purple and black tribal-diamond print, styled here on location. A favourite for layering over plain tees and turtlenecks.",
      fabric: "100% cotton wax print, poly-blend lining",
      priceMinor: 58000,
      featured: true,
      image: "bomber-purple-tribal-lifestyle-01.webp",
      secondImage: "bomber-purple-tribal-lifestyle-02.webp",
    },
    {
      name: "Kwame Navy Pattern Bomber",
      slug: "kwame-navy-pattern-bomber",
      description:
        "Navy and white all-over pattern print with a sharper, more graphic look. Shown here in natural light to give a true sense of the colourway.",
      fabric: "100% cotton wax print, poly-blend lining",
      priceMinor: 58000,
      featured: false,
      image: "bomber-navy-pattern-lifestyle.webp",
    },
  ];

  for (const p of bomberProducts) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        fabric: p.fabric,
        priceMinor: p.priceMinor,
        compareAtMinor: p.compareAtMinor,
        featured: p.featured,
        categoryId: bombers.id,
        images: {
          create: [
            { url: `/images/products/${p.image}`, alt: p.name, position: 0 },
            ...(p.secondImage
              ? [
                  {
                    url: `/images/products/${p.secondImage}`,
                    alt: `${p.name} styled`,
                    position: 1,
                  },
                ]
              : []),
          ],
        },
        variants: {
          create: adultSizes.map((label, i) => ({
            label,
            stock: 8 - i, // more stock in smaller sizes as a realistic placeholder
          })),
        },
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  const fabricProduct = await prisma.product.create({
    data: {
      name: "Antiquity Teal Tribal Wax Print",
      slug: "antiquity-teal-tribal-wax-print",
      description:
        "Guaranteed superior wax, 100% cotton, sold as a 6-yard piece — enough for a full outfit or a custom bomber order. Teal and black tribal-diamond design.",
      fabric: "100% cotton, 6 yards per piece",
      priceMinor: 18000,
      featured: true,
      categoryId: fabric.id,
      images: {
        create: [
          {
            url: "/images/fabric/fabric-teal-tribal.webp",
            alt: "Antiquity teal tribal wax print, folded",
            position: 0,
          },
          {
            url: "/images/fabric/fabric-teal-tribal-fold.webp",
            alt: "Antiquity teal tribal wax print, detail",
            position: 1,
          },
        ],
      },
      variants: {
        create: [{ label: "6 yards", stock: 20 }],
      },
    },
  });
  console.log(`Created product: ${fabricProduct.name}`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
