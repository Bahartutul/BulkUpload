using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FetchFolderContent.Models.VM
{
    public class UpdateBulkVM
    {
        public int FolderID { get; set; }
        public string FileID { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileTag { get; set; }
        public List<mytags> tags { get; set; }
        public string description { get; set; }
    }

public class mytags{
    public string text { get; set; }
}
}