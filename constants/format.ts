export function formatNumberWithSubscriptZeros(
  numberStr: string,
  presiction = 3,
  min = 0.01
): string {
  const number = parseFloat(numberStr);
  if (number >= min) {
    const [part0, part1] = numberStr.split(".");
    if (part1) {
      const leadingZeros = part1?.match?.(/^0+/)?.[0] || "";
      return `${part0}.${leadingZeros}${part1.replace(leadingZeros, "").slice(0, presiction)}`;
    }
    return part1 ? [part0, part1.slice(0, presiction)].join(".") : part0;
  }

  const leadingZerosMatch = numberStr.match(/^0\.(0+)/);
  if (!leadingZerosMatch) return numberStr;

  const leadingZerosCount = leadingZerosMatch[1].length;
  const remainingDigits = numberStr.slice(leadingZerosMatch[0].length);

  const smallCount = String(leadingZerosCount)
    .split("")
    .map((digit) => String.fromCharCode(8320 + parseInt(digit)))
    .join("");

  return `0.0${smallCount}${remainingDigits.slice(0, presiction)}`;
}

export function formatWithAbbreviation(price: number): string {
  if (price >= 1_000_000_000_000) {
    return (price / 1_000_000_000_000).toFixed(2) + "T";
  } else if (price >= 1_000_000_000) {
    return (price / 1_000_000_000).toFixed(2) + "B";
  } else if (price >= 1_000_000) {
    return (price / 1_000_000).toFixed(2) + "M";
  } else if (price >= 1_000) {
    return (price / 1_000).toFixed(2) + "K";
  }
  return price.toString();
}

export const formatZeros = (price: number | null): string | null => {
  const numericPrice = Number(price);

  // const numericPriceFormatted =
  //   numericPrice > 0.00001 ? numericPrice.toString() : numericPrice.toFixed(12);

  let numericPriceFormatted: string;

  if (numericPrice >= 1_000_000) {
    return formatWithAbbreviation(numericPrice);
  }

  if (numericPrice > 0.00001) {
    numericPriceFormatted = numericPrice.toString();
  } else {
    numericPriceFormatted = numericPrice.toFixed(12);
  }

  if (Number(numericPriceFormatted) >= 1) {
    return parseFloat(numericPriceFormatted).toLocaleString("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      // style: 'currency',
      // currency: 'USD',
    });
  } else {
    const decimalPart = numericPriceFormatted.split(".")[1] || "";
    const leadingZeros = decimalPart.match(/^0+/)?.[0]?.length || 0;
    if (leadingZeros > 1) {
      return formatNumberWithSubscriptZeros(numericPriceFormatted);
    } else {
      return numericPrice.toLocaleString("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        // style: 'currency',
        // currency: 'USD',
      });
    }
  }
};

export const formatMarkdown = (text: string) => {
  // Bold formatting: **bold text**
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic formatting: *italic text*
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Bullet points: * text
  text = text.replace(/^\*\s(.*)$/gm, "<ul><li>$1</li></ul>");

  // Convert line breaks for paragraphs
  text = text
    .split("\n")
    .map((line) => `<p>${line}</p>`)
    .join("");

  return text;
};

export const convertBalanceToReadable = (balance: string, decimals: number) => {
  return parseFloat(balance) / Math.pow(10, decimals);
};
