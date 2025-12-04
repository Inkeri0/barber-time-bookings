import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { productService, Product } from '@/services/product.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

const mockProducts: Product[] = [
  { id: '1', barberId: 'b1', name: 'Classic Pomade', description: 'Strong hold, matte finish', category: 'pomade', price: 24.99, compareAtPrice: 29.99, images: ['https://images.unsplash.com/photo-1597854710235-1d2c3e16e3ad?w=300'], stock: 15, isActive: true, createdAt: '2024-10-01' },
  { id: '2', barberId: 'b1', name: 'Beard Oil', description: 'Natural oils blend', category: 'beard_oil', price: 19.99, images: ['https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?w=300'], stock: 8, isActive: true, createdAt: '2024-10-01' },
  { id: '3', barberId: 'b1', name: 'Styling Gel', description: 'Maximum hold gel', category: 'gel', price: 14.99, images: ['https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=300'], stock: 20, isActive: true, createdAt: '2024-10-01' },
];

const Shop = () => {
  const { t } = useLanguage();
  const { barberId } = useParams();
  const [category, setCategory] = useState<string>('all');
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);

  const { data: products = mockProducts, isLoading } = useQuery({
    queryKey: ['shop-products', barberId],
    queryFn: () => productService.getBarberProducts(barberId!),
    enabled: !!barberId,
    retry: false,
  });

  const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">{t('shop.title')}</h1>
              <p className="text-muted-foreground">{t('shop.subtitle')}</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-40"><SelectValue placeholder={t('shop.allCategories')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('shop.allCategories')}</SelectItem>
                  <SelectItem value="pomade">{t('shop.pomade')}</SelectItem>
                  <SelectItem value="gel">{t('shop.gel')}</SelectItem>
                  <SelectItem value="beard_oil">{t('shop.beardOil')}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">{cartCount}</Badge>}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-80" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
                  </Link>
                  <CardContent className="p-4">
                    <Link to={`/product/${product.id}`} className="hover:underline">
                      <h3 className="font-semibold">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold">€{product.price}</span>
                        {product.compareAtPrice && <span className="text-sm text-muted-foreground line-through ml-2">€{product.compareAtPrice}</span>}
                      </div>
                      {product.stock < 5 && <Badge variant="destructive">{t('shop.lowStock')}</Badge>}
                    </div>
                    <Button className="w-full mt-3" onClick={() => addToCart(product.id)} disabled={product.stock === 0}>
                      {product.stock === 0 ? t('shop.outOfStock') : t('shop.addToCart')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
