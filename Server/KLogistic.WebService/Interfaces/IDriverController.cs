﻿using System.ServiceModel;
using System.ServiceModel.Web;

namespace KLogistic.WebService
{
    [ServiceContract]
    public interface IDriverService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getdrivers", ResponseFormat = WebMessageFormat.Json)]
        GetDriversResponse GetDrivers(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getdriver", ResponseFormat = WebMessageFormat.Json)]
        GetDriverResponse GetDriver(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "updatedriver", ResponseFormat = WebMessageFormat.Json)]
        Response UpdateDriver(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "adddriver", ResponseFormat = WebMessageFormat.Json)]
        GetDriverResponse AddDriver(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "blockdriver", ResponseFormat = WebMessageFormat.Json)]
        Response BlockDriver(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "unblockdriver", ResponseFormat = WebMessageFormat.Json)]
        Response UnblockDriver(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getblockeddrivers", ResponseFormat = WebMessageFormat.Json)]
        GetDriversResponse GetBlockedDrivers(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "removedriver", ResponseFormat = WebMessageFormat.Json)]
        Response RemoveDriver(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "restoredriver", ResponseFormat = WebMessageFormat.Json)]
        Response RestoreDriver(ServiceRequest request);
    }
}
