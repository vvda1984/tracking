﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetUserResponse : Response
    {
        [DataMember(Name = "item")]
        public UserModel Item { get; set; }
    }
}