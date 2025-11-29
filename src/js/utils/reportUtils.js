export function filterOrdersByDateRange(orders, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return orders.filter((order) => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= start && orderDate <= end;
  });
}

export function filterInvoicesByDateRange(invoices, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return invoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.invoiceDate);
    return invoiceDate >= start && invoiceDate <= end;
  });
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatCurrency(amount) {
  return `LKR ${parseFloat(amount || 0).toFixed(2)}`;
}
