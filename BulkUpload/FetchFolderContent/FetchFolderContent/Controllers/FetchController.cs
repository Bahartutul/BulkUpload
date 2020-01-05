using FetchFolderContent.Models;
using FetchFolderContent.Models.VM;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity.Migrations;

namespace FetchFolderContent.Controllers
{
	public class FetchController : Controller
	{
		private readonly ImageContext _context = new ImageContext();
		//
		// GET: /Fetch/
		public ActionResult Index()
		{
			return View();
		}

		public ActionResult FetchFolder()
		{
			string path=@"G:\DAmiProject\Image1";
			string[] files = Directory.GetFiles(@"G:\DAmiProject\Image1");
			int count = 0;
			foreach (var f in files)
			{
				count++;
				
				DmsBulkFileUpload dbfu = new DmsBulkFileUpload();
				dbfu.FilePath = f;
				dbfu.FolderID = 1;
				dbfu.FileName=f.Substring(f.LastIndexOf('\\')+1);
				dbfu.FileID = dbfu.FolderID + "-" + count;
				_context.DmsBulkFileUploads.Add(dbfu);
			}
			_context.SaveChanges();
			return null;
		}

		public ActionResult GetAllImage()
		{
			string[] files = Directory.GetFiles(@"G:\DAmiProject\Image1");

			var allPath = _context.DmsBulkFileUploads.ToList();
			
			return Json(allPath, JsonRequestBehavior.AllowGet);
		}
		public void RenderImage(string filepath)
		{
			if (filepath != null)
			{
				try
				{
					
					string contenttype = "image/" + Path.GetExtension(filepath);
					FileStream fs = new FileStream(filepath, FileMode.Open, FileAccess.Read);
					BinaryReader br = new BinaryReader(fs);
					Byte[] bytes = br.ReadBytes((Int32)fs.Length);
					br.Close();
					fs.Close();
					
					Response.Buffer = true;
					Response.Charset = "";
					Response.Cache.SetCacheability(HttpCacheability.NoCache);
					Response.ContentType = contenttype;
					Response.AddHeader("content-disposition", "attachment;filename=" + Path.GetFileName(filepath));
					Response.BinaryWrite(bytes);
					Response.Flush();
					Response.End();
				}
				catch
				{

				}
			}
		}


		[HttpPost]
		public ActionResult UpdateRow(List<UpdateBulkVM> m)
		{
			foreach(var singleObj in m){
				var tag="";
				int count = 0;
				int totalSize = 0;
				if (singleObj.tags != null)
				{
					totalSize = singleObj.tags.Count;

					foreach (var t in singleObj.tags)
					{
						count++;

						if (t != null)
						{
							if (count < totalSize)
							{
								tag += t.text + ",";
							}
							else
							{
								tag += t.text;
							}
						}

					}
				}
				var existsOrNot = _context.DmsBulkFileUploads.Where(x => x.FilePath == singleObj.FilePath).FirstOrDefault();
				if (existsOrNot !=null)
				{
					existsOrNot.FileTag = tag!=""?tag:null;
					existsOrNot.Description = singleObj.description;
					_context.DmsBulkFileUploads.AddOrUpdate(existsOrNot);
				}
				else
				{

				}
				_context.SaveChanges();
			}
			return null;
		}
	}
}