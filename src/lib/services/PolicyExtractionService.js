import { supabase } from '../supabase';

export class PolicyExtractionService {
  static async uploadDocument(file, productId) {
    if (!productId) {
      throw new Error("Product must be saved before uploading documents.");
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('policy-documents')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    return filePath;
  }

  static async processJob(files, productId, onProgressCallback) {
    if (!productId) throw new Error("Please save the product as a draft before importing AI documents.");
    
    if (onProgressCallback) onProgressCallback(5, "Uploading documents...");
    
    // 1. Upload files
    const documentPaths = [];
    for (const file of files) {
      const path = await this.uploadDocument(file, productId);
      documentPaths.push(path);
    }
    
    if (onProgressCallback) onProgressCallback(20, "Creating import job...");

    // 2. Create Import Job
    const { data: importJob, error: importError } = await supabase
      .from('product_ai_imports')
      .insert([{
        product_id: productId,
        documents: documentPaths,
        status: 'QUEUED'
      }])
      .select()
      .single();

    if (importError) throw importError;

    if (onProgressCallback) onProgressCallback(30, "Triggering AI processing...");

    // 3. Trigger Edge Function
    const { data: edgeResponse, error: edgeError } = await supabase.functions.invoke('process-policy-document', {
      body: {
        import_id: importJob.id,
        product_id: productId,
        documents: documentPaths
      }
    });

    if (edgeError || (edgeResponse && edgeResponse.error)) {
      throw new Error(edgeError?.message || edgeResponse?.error || 'Unknown edge function error');
    }

    if (onProgressCallback) onProgressCallback(100, "Processing complete. Please review data.");
    
    return importJob;
  }
}
