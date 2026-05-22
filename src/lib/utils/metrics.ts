import { orderRepository, productRepository } from '../services/repositories';

export async function getDashboardMetrics() {
  const [orders, products] = await Promise.all([
    orderRepository.getAll(),
    productRepository.getAll(),
  ]);

  const totalRevenue = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const avgOrderValue = orders.length > 0 
    ? totalRevenue / orders.length 
    : 0;

  const lowStockCount = products.filter(p => p.stock < 5).length;

  return {
    totalRevenue,
    avgOrderValue,
    totalOrders: orders.length,
    lowStockCount,
  };
}
