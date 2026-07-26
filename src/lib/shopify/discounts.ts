import { adminFetch, isShopifyAdminConfigured } from "@/lib/shopify/admin-client";

export interface PromoCode {
  code: string;
  title: string;
  label: string;
  isPrepaid: boolean;
}

const DISCOUNTS_QUERY = `
  query ActiveDiscounts {
    codeDiscountNodes(first: 20, query: "status:active") {
      nodes {
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            codes(first: 1) { nodes { code } }
            customerGets {
              value {
                ... on DiscountPercentage { percentage }
                ... on DiscountAmount { amount { amount currencyCode } }
              }
            }
            minimumRequirement {
              ... on DiscountMinimumSubtotal { greaterThanOrEqualToSubtotal { amount currencyCode } }
            }
          }
        }
      }
    }
  }
`;

interface DiscountCodeBasicNode {
  title: string;
  codes: { nodes: { code: string }[] };
  customerGets: {
    value: { percentage?: number } | { amount?: { amount: string; currencyCode: string } };
  };
  minimumRequirement: {
    greaterThanOrEqualToSubtotal?: { amount: string; currencyCode: string };
  } | null;
}

function formatRupees(amount: string): string {
  return `₹${Math.round(parseFloat(amount))}`;
}

function buildLabel(node: DiscountCodeBasicNode): string {
  const value = node.customerGets.value as { percentage?: number; amount?: { amount: string } };
  const discountText =
    value.percentage !== undefined
      ? `${Math.round(value.percentage * 100)}% off`
      : value.amount
        ? `${formatRupees(value.amount.amount)} off`
        : "Discount";

  const minSubtotal = node.minimumRequirement?.greaterThanOrEqualToSubtotal;
  if (minSubtotal) {
    return `${discountText} orders above ${formatRupees(minSubtotal.amount)}`;
  }
  return discountText;
}

export async function getActivePromoCodes(): Promise<PromoCode[]> {
  if (!isShopifyAdminConfigured()) return [];

  try {
    const data = await adminFetch<{ codeDiscountNodes: { nodes: { codeDiscount: DiscountCodeBasicNode | null }[] } }>(
      DISCOUNTS_QUERY,
    );

    return data.codeDiscountNodes.nodes
      .map((n) => n.codeDiscount)
      .filter((n): n is DiscountCodeBasicNode => n !== null && n.codes.nodes.length > 0)
      .map((node) => {
        const code = node.codes.nodes[0].code;
        return {
          code,
          title: node.title,
          label: buildLabel(node),
          isPrepaid: /prepaid/i.test(node.title) || /prepaid/i.test(code),
        };
      });
  } catch {
    return [];
  }
}
