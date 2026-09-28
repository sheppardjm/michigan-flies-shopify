const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  availableForSale
  tags
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  featuredImage {
    url
    altText
    width
    height
  }
`;

const VARIANT_FIELDS = `
  id
  title
  availableForSale
  price {
    amount
    currencyCode
  }
  selectedOptions {
    name
    value
  }
`;

export const PRODUCTS_QUERY = `
  query Products($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      nodes {
        ${PRODUCT_FIELDS}
        variants(first: 10) {
          nodes {
            ${VARIANT_FIELDS}
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ${PRODUCT_FIELDS}
      variants(first: 100) {
        nodes {
          ${VARIANT_FIELDS}
        }
      }
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            product {
              title
              handle
            }
            image {
              url
              altText
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export const CREATE_CART_MUTATION = `
  mutation CartCreate {
    cartCreate(input: {}) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const ADD_TO_CART_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const UPDATE_CART_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const REMOVE_FROM_CART_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const GET_CART_QUERY = `
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;
