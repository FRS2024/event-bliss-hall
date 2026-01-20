import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const FAQ_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'booking', label: 'Booking' },
  { value: 'payments', label: 'Payments' },
  { value: 'hosting', label: 'Hosting' },
] as const;

export const useFAQs = (category?: string) => {
  return useQuery({
    queryKey: ['faqs', category],
    queryFn: async () => {
      let query = supabase
        .from('faqs')
        .select('*')
        .order('category')
        .order('display_order');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as FAQ[];
    },
  });
};

export const usePublishedFAQs = (category?: string) => {
  return useQuery({
    queryKey: ['faqs', 'published', category],
    queryFn: async () => {
      let query = supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .order('category')
        .order('display_order');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as FAQ[];
    },
  });
};

export const useFAQCategories = () => {
  return useQuery({
    queryKey: ['faq-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('category')
        .eq('is_published', true);
      
      if (error) throw error;
      
      const categories = [...new Set(data.map(f => f.category))];
      return categories;
    },
  });
};

export const useCreateFAQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (faq: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('faqs')
        .insert(faq)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] });
    },
  });
};

export const useUpdateFAQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FAQ> & { id: string }) => {
      const { data, error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] });
    },
  });
};

export const useDeleteFAQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faq-categories'] });
    },
  });
};
