//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace FetchFolderContent.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class DmsBulkFileUpload
    {
        public int IdentityID { get; set; }
        public Nullable<int> FolderID { get; set; }
        public string FileID { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileTag { get; set; }
        public Nullable<System.DateTime> UploadDate { get; set; }
        public string Description { get; set; }
        public Nullable<byte> FileMoveYN { get; set; }
        public Nullable<byte> FileActiveYN { get; set; }
        public Nullable<byte> FileMovementCompletedYN { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
